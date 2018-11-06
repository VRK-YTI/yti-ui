import { Injectable } from '@angular/core';
import { ServiceConfiguration } from '../entities/service-configuration';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  configuration?: ServiceConfiguration;
  configurationError = false;

  configurationPromise: Promise<ServiceConfiguration>;

  constructor(private http: HttpClient) {
    this.configurationPromise = new Promise((resolve, refuse) => {
      this.http.get<ServiceConfiguration>(`${apiUrl}/configuration`)
        .subscribe(configuration => {
          this.configuration = configuration;
          resolve(configuration);
        }, error => {
          this.configurationError = true;
          refuse(error);
        });
    });
  }

  get loading(): boolean {
    return !this.configuration;
  }

  get showUnfinishedFeature(): Promise<boolean> {
    return this.configurationPromise.then(cfg => {
      const env = (cfg.env || '').toLowerCase();
      return env === 'dev' || env === 'local';
    });
  }
}
