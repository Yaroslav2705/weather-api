/**
 * Weather Forecast API
 * Weather API application that allows users to subscribe to weather updates for their city.
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Injectable, Optional } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, from, of, switchMap } from 'rxjs';
import { SubscribeRequest } from '../model/subscribeRequest';
import { Configuration } from '../configuration';
import { COLLECTION_FORMATS } from '../variables';


@Injectable()
export class SubscriptionService {

    protected basePath = 'http://weatherapi.app/api';
    public defaultHeaders: Record<string,string> = {};
    public configuration = new Configuration();
    protected httpClient: HttpService;

    constructor(httpClient: HttpService, @Optional() configuration: Configuration) {
        this.configuration = configuration || this.configuration;
        this.basePath = configuration?.basePath || this.basePath;
        this.httpClient = configuration?.httpClient || httpClient;
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        return consumes.includes(form);
    }

    /**
     * Confirm email subscription
     * Confirms a subscription using the token sent in the confirmation email.
     * @param token Confirmation token
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     * @param {*} [confirmSubscriptionOpts.config] Override http request option.
     */
    public confirmSubscription(token: string, confirmSubscriptionOpts?: { config?: AxiosRequestConfig }): Observable<AxiosResponse<any>>;
    public confirmSubscription(token: string, confirmSubscriptionOpts?: { config?: AxiosRequestConfig }): Observable<any> {
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling confirmSubscription.');
        }

        let headers = {...this.defaultHeaders};

        let accessTokenObservable: Observable<any> = of(null);

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return accessTokenObservable.pipe(
            switchMap((accessToken) => {
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                return this.httpClient.get<any>(`${this.basePath}/confirm/${encodeURIComponent(String(token))}`,
                    {
                        withCredentials: this.configuration.withCredentials,
                        ...confirmSubscriptionOpts?.config,
                        headers: {...headers, ...confirmSubscriptionOpts?.config?.headers},
                    }
                );
            })
        );
    }
    /**
     * Subscribe to weather updates
     * Subscribe an email to receive weather updates for a specific city with chosen frequency.
     * @param subscribeRequest 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     * @param {*} [subscribeOpts.config] Override http request option.
     */
    public subscribe(subscribeRequest: SubscribeRequest, subscribeOpts?: { config?: AxiosRequestConfig }): Observable<AxiosResponse<any>>;
    public subscribe(subscribeRequest: SubscribeRequest, subscribeOpts?: { config?: AxiosRequestConfig }): Observable<any> {
        if (subscribeRequest === null || subscribeRequest === undefined) {
            throw new Error('Required parameter subscribeRequest was null or undefined when calling subscribe.');
        }

        let headers = {...this.defaultHeaders};

        let accessTokenObservable: Observable<any> = of(null);

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json',
            'application/x-www-form-urlencoded'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers['Content-Type'] = httpContentTypeSelected;
        }
        return accessTokenObservable.pipe(
            switchMap((accessToken) => {
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                return this.httpClient.post<any>(`${this.basePath}/subscribe`,
                    subscribeRequest,
                    {
                        withCredentials: this.configuration.withCredentials,
                        ...subscribeOpts?.config,
                        headers: {...headers, ...subscribeOpts?.config?.headers},
                    }
                );
            })
        );
    }
    /**
     * Unsubscribe from weather updates
     * Unsubscribes an email from weather updates using the token sent in emails.
     * @param token Unsubscribe token
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     * @param {*} [unsubscribeOpts.config] Override http request option.
     */
    public unsubscribe(token: string, unsubscribeOpts?: { config?: AxiosRequestConfig }): Observable<AxiosResponse<any>>;
    public unsubscribe(token: string, unsubscribeOpts?: { config?: AxiosRequestConfig }): Observable<any> {
        if (token === null || token === undefined) {
            throw new Error('Required parameter token was null or undefined when calling unsubscribe.');
        }

        let headers = {...this.defaultHeaders};

        let accessTokenObservable: Observable<any> = of(null);

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers['Accept'] = httpHeaderAcceptSelected;
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];
        return accessTokenObservable.pipe(
            switchMap((accessToken) => {
                if (accessToken) {
                    headers['Authorization'] = `Bearer ${accessToken}`;
                }

                return this.httpClient.get<any>(`${this.basePath}/unsubscribe/${encodeURIComponent(String(token))}`,
                    {
                        withCredentials: this.configuration.withCredentials,
                        ...unsubscribeOpts?.config,
                        headers: {...headers, ...unsubscribeOpts?.config?.headers},
                    }
                );
            })
        );
    }
}
