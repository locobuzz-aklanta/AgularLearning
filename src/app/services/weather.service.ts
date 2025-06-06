import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WeatherResponse } from '../interfaces/weather.interface';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly API_KEY = '47c646d477384fa089541246250606'; // Replace with your actual API key
  private readonly BASE_URL = 'https://api.weatherapi.com/v1';
  
  private locationSubject = new BehaviorSubject<{lat: number, lon: number} | null>(null);
  public location$ = this.locationSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCurrentWeather(location: string): Observable<WeatherResponse> {
    const url = `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${location}&aqi=yes`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  getForecastWeather(location: string, days: number = 3): Observable<WeatherResponse> {
    const url = `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${location}&days=${days}&aqi=yes&alerts=yes`;
    return this.http.get<WeatherResponse>(url).pipe(
      catchError(this.handleError)
    );
  }

  searchLocations(query: string): Observable<any[]> {
    const url = `${this.BASE_URL}/search.json?key=${this.API_KEY}&q=${query}`;
    return this.http.get<any[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationSubject.next({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          resolve(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<WeatherResponse> {
    return this.getForecastWeather(`${lat},${lon}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred while fetching weather data.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid API key. Please check your API configuration.';
          break;
        case 400:
          errorMessage = 'Bad request. Please check the location parameter.';
          break;
        case 403:
          errorMessage = 'API key has exceeded calls per month quota or access denied.';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Weather API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}