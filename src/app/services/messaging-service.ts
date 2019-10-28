import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessagingUserType } from './messaging-api-schema';
import { MessagingUser } from '../entities-messaging/messaging-user';
import { MessagingSubscriptionTypeRequest } from '../entities-messaging/messaging-subscription-type-request';
import { MessagingSubscriptionRequest } from '../entities-messaging/messaging-subscription-request';

const api = 'api';
const version = 'v1';
const ACTION_GET = 'GET';
const ACTION_ADD = 'ADD';
const ACTION_DELETE = 'DELETE';
const user = 'user';
const subscriptions = 'subscriptions';
const subscriptiontype = 'subscriptiontype';
const messagingApiContext = 'messaging-api';
const messagingBaseApiPath = `/${messagingApiContext}/${api}/${version}`;
const messagingApiBasePath = `${messagingBaseApiPath}`;

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(private http: HttpClient) {
  }

  subscriptionRequest(resourceUri: string, type: string | undefined, action: string): Observable<boolean> {

    const subscriptionRequest: MessagingSubscriptionRequest = new MessagingSubscriptionRequest();
    subscriptionRequest.uri = resourceUri;
    if (type) {
      subscriptionRequest.type = type;
    }
    subscriptionRequest.action = action;

    return this.http.post(`${messagingApiBasePath}/${subscriptions}/`, subscriptionRequest, { observe: 'response' })
      .pipe(map(res => res.status === 200),
        catchError(err => of(false))
      );
  }

  getSubscription(resourceUri: string): Observable<boolean> {

    return this.subscriptionRequest(resourceUri, undefined, ACTION_GET);
  }

  addSubscription(resourceUri: string, type: string): Observable<boolean> {

    return this.subscriptionRequest(resourceUri, type, ACTION_ADD);
  }

  deleteSubscription(resourceUri: string): Observable<boolean> {

    return this.subscriptionRequest(resourceUri, undefined, ACTION_DELETE);
  }

  getMessagingUserData(): Observable<MessagingUser | undefined> {

    return this.http.get<MessagingUserType>(`${messagingApiBasePath}/${user}`)
      .pipe(map(res => new MessagingUser(res)),
        catchError(err => of(undefined)));
  }

  setSubscriptionType(subscriptionType: string): Observable<MessagingUser> {

    const subscriptionTypeRequest: MessagingSubscriptionTypeRequest = new MessagingSubscriptionTypeRequest();
    subscriptionTypeRequest.subscriptionType = subscriptionType;

    return this.http.post<MessagingUserType>(`${messagingApiBasePath}/${user}/${subscriptiontype}`, subscriptionTypeRequest)
      .pipe(map(res => new MessagingUser(res)));
  }
}
