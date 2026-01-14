import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationalAnalyticsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private conversationHistory: any[] = [];

  constructor() { }

  resetConversation() {
    this.conversationHistory = [];
  }

  sendMessage(prompt: string): Observable<any[]> {
    const { projectId, location, lookerClientId, lookerClientSecret, lookerInstanceUrl, lookerModel, lookerExplore } = environment;
    const accessToken = this.authService.accessToken;

    if (!projectId) {
      console.warn('Missing Project ID');
      return of([{ role: 'model', type: 'text', text: 'Please configure `environment.ts` with your Google Cloud Project ID.' }]);
    }

    if (!accessToken) {
      console.warn('User Not Logged In');
      return of([{ role: 'model', type: 'text', text: 'Please sign in to use the chat.' }]);
    }

    const apiUrl = `https://geminidataanalytics.googleapis.com/v1beta/projects/${projectId}/locations/${location}:chat`;

    // 1. Append User Message
    this.conversationHistory.push({
      userMessage: { text: prompt }
    });

    // 2. Construct Payload
    // Match structure from Python snippet (snake_case)
    const payload: any = {
      messages: this.conversationHistory,
      inline_context: {
        datasource_references: {
          looker: {
            explore_references: [
              {
                lookml_model: lookerModel || 'MISSING_MODEL',
                explore: lookerExplore || 'MISSING_EXPLORE',
                looker_instance_uri: lookerInstanceUrl || 'MISSING_URL'
              }
            ]
          }
        }
      }
    };

    if (lookerClientId && lookerClientId !== 'YOUR_LOOKER_CLIENT_ID') {
      // Add credentials inside looker
      payload.inline_context.datasource_references.looker.credentials = {
        oauth: {
          secret: {
            client_id: lookerClientId,
            client_secret: lookerClientSecret
          }
        }
      };
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    return this.http.post<any>(apiUrl, payload, { headers }).pipe(
      tap(response => {
        console.log('Full API Response:', response);
        if (Array.isArray(response)) {
          // Response is an array of Message objects (e.g. Schema, Thoughts, Final Response)
          // We should add ALL of them to history to maintain context
          this.conversationHistory.push(...response);
        } else if (response) {
          // Fallback if it's a single object (unlikely based on logs)
          this.conversationHistory.push(response);
        }
      }),
      map(response => {
        const mappedMessages: any[] = [];

        const processMessage = (msg: any) => {
          // Schema is explicitly excluded from UI per user request
          // if (msg?.systemMessage?.schema) {
          //   mappedMessages.push({ role: 'model', type: 'schema', content: msg.systemMessage.schema });
          // }
          if (msg?.systemMessage?.chart) {
            // Extract the specific Vega config if present (handling nested 'result' wrapper)
            let chartContent = msg.systemMessage.chart;

            if (chartContent.result?.vegaConfig) {
              chartContent = chartContent.result.vegaConfig;
            } else if (chartContent.vegaConfig) {
              chartContent = chartContent.vegaConfig;
            }

            // Only add if it looks like a valid Vega spec (prevents "Invalid specification" errors for metadata-only objects)
            const isLikelyVega = chartContent.mark || chartContent.layer || chartContent.concat || chartContent.hconcat || chartContent.vconcat || chartContent.facet || chartContent.repeat || (chartContent.data && chartContent.encoding);

            if (isLikelyVega) {
              mappedMessages.push({ role: 'model', type: 'chart', content: chartContent });
            }
          }
          if (msg?.systemMessage?.text?.parts) {
            const rawText = msg.systemMessage.text.parts.join('\n');
            const cleanText = rawText.replace(/```json[\s\S]*?```/g, '').trim();
            if (cleanText) {
              mappedMessages.push({ role: 'model', type: 'text', text: cleanText });
            }
          }
          // Fallbacks for older structure if mixed
          if (msg?.modelMessage?.text?.parts) {
            const rawText = msg.modelMessage.text.parts.join('\n');
            const cleanText = rawText.replace(/```json[\s\S]*?```/g, '').trim();
            if (cleanText) mappedMessages.push({ role: 'model', type: 'text', text: cleanText });
          }
        };

        if (Array.isArray(response)) {
          response.forEach(processMessage);
        } else if (response) {
          processMessage(response);
          // Fallback for Candidate structure
          if (response?.candidates?.[0]?.message?.modelMessage?.text) {
            const rawText = response.candidates[0].message.modelMessage.text;
            const cleanText = rawText.replace(/```json[\s\S]*?```/g, '').trim();
            if (cleanText) mappedMessages.push({ role: 'model', type: 'text', text: cleanText });
          }
          // candidates structure fallback for parts
          if (response?.candidates?.[0]?.message?.modelMessage?.text?.parts) {
            const rawText = response.candidates[0].message.modelMessage.text.parts.join('\n');
            const cleanText = rawText.replace(/```json[\s\S]*?```/g, '').trim();
            if (cleanText) mappedMessages.push({ role: 'model', type: 'text', text: cleanText });
          }
        }

        // Sort messages: Text first, then Chart, then Schema (if enabled)
        // This ensures the explanations appear before the visuals
        mappedMessages.sort((a, b) => {
          const typeOrder: Record<string, number> = { 'text': 1, 'chart': 2, 'schema': 3 };
          return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
        });

        if (mappedMessages.length === 0) {
          return [{ role: 'model', type: 'text', text: 'Received response, but could not extract content.' }];
        }

        return mappedMessages;
      }),
      catchError(err => {
        console.error('Conversational Analytics API Error:', err);
        return of([{ role: 'model', type: 'text', text: `Error: ${err.message || 'Unknown API error'}` }]);
      })
    );
  }
}