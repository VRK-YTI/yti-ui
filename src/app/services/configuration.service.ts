import { Injectable } from '@angular/core';
import { ServiceConfiguration } from '../entities/service-configuration';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private configurationPromise?: Promise<ServiceConfiguration>;
  private configuration_?: ServiceConfiguration;

  constructor(private http: HttpClient) {
  }

  get configuration(): ServiceConfiguration {
    if (this.configuration_) {
      return this.configuration_;
    }
    throw new Error("ConfigurationService used before initialization");
  }

  get environment(): string {
    return this.configuration.env;
  }

  get codeListUrl(): string {
    return this.configuration.codeListUrl;
  }

  get dataModelUrl(): string {
    return this.configuration.dataModelUrl;
  }

  get commentsUrl(): string {
    return this.configuration.commentsUrl;
  }

  get groupManagementUrl(): string {
    return this.configuration.groupmanagementUrl;
  }

  get showUnfinishedFeature(): boolean {
    const env = (this.configuration.env || '').toLowerCase();
    return env === 'dev' || env === 'awsdev' || env === 'local';
  }

  get showAlmostReadyFeature(): boolean {
    const env = (this.configuration.env || '').toLowerCase();
    return env === 'dev' || env === 'awsdev' || env === 'local' || env === 'test';
  }

  get isMessagingEnabled(): boolean {
    return this.configuration.messagingEnabled;
  }

  get restrictFilterOptions(): boolean {
    return this.configuration.restrictFilterOptions;
  }

  getEnvironmentIdentifier(style?: 'prefix' | 'postfix'): string {
    if (this.environment !== 'prod') {
      const identifier = this.environment.toUpperCase();
      if (!style) {
        return identifier;
      } else if (style === 'prefix') {
        return identifier + ' - ';
      } else if (style === 'postfix') {
        return ' - ' + identifier;
      }
    }
    return '';
  }

  fetchConfiguration(): Promise<ServiceConfiguration> {
    if (!this.configurationPromise) {
      this.configurationPromise = new Promise((resolve, refuse) => {
        this.http.get<ServiceConfiguration>(`${apiUrl}/configuration`)
          .subscribe(configuration => {
            this.configuration_ = configuration;
            resolve(configuration);
          }, error => {
            refuse(error);
          });
      });
    }
    return this.configurationPromise;
  }

  getUriWithEnv(uri: string): string | null {

    if (uri && this.environment !== 'prod') {
      return uri + '?env=' + this.environment;
    }
    return uri ? uri : null;
  }
}
