import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { WeatherResponse } from '../interfaces/weather.interface';
import { NgFor, NgIf, NgClass, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe, DecimalPipe, TitleCasePipe, FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit, OnDestroy {
  weatherData: WeatherResponse | null = null;
  loading = false;
  error: string | null = null;
  searchQuery = '';
  searchResults: any[] = [];
  temperatureUnit: 'C' | 'F' = 'C';
  windUnit: 'kph' | 'mph' = 'kph';
  isSearching = false;
  locationPermissionDenied = false;
  
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadUserLocation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadUserLocation(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const position = await this.weatherService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      this.weatherService.getWeatherByCoordinates(latitude, longitude)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.weatherData = data;
            this.loading = false;
          },
          error: (error) => {
            this.error = error.message;
            this.loading = false;
            this.loadDefaultLocation();
          }
        });
    } catch (error: any) {
      console.error('Geolocation error:', error);
      this.locationPermissionDenied = true;
      this.loadDefaultLocation();
    }
  }

  loadDefaultLocation(): void {
    this.loadWeatherData('London');
  }

  loadWeatherData(location: string): void {
    this.loading = true;
    this.error = null;

    this.weatherService.getForecastWeather(location, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }

  searchLocations(): void {
    if (this.searchQuery.trim().length < 3) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;
    this.weatherService.searchLocations(this.searchQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.searchResults = [];
          this.isSearching = false;
        }
      });
  }

  selectLocation(location: any): void {
    this.searchQuery = `${location.name}, ${location.region}, ${location.country}`;
    this.searchResults = [];
    this.loadWeatherData(`${location.lat},${location.lon}`);
  }

  toggleTemperatureUnit(): void {
    this.temperatureUnit = this.temperatureUnit === 'C' ? 'F' : 'C';
  }

  toggleWindUnit(): void {
    this.windUnit = this.windUnit === 'kph' ? 'mph' : 'kph';
  }

  getTemperature(tempC: number, tempF: number): number {
    return this.temperatureUnit === 'C' ? tempC : tempF;
  }

  getWindSpeed(kph: number, mph: number): number {
    return this.windUnit === 'kph' ? kph : mph;
  }

  refreshWeather(): void {
    if (this.weatherData) {
      this.loadWeatherData(`${this.weatherData.location.lat},${this.weatherData.location.lon}`);
    } else {
      this.loadUserLocation();
    }
  }

  getAirQualityLevel(index: number): string {
    switch (index) {
      case 1: return 'Good';
      case 2: return 'Moderate';
      case 3: return 'Unhealthy for Sensitive Groups';
      case 4: return 'Unhealthy';
      case 5: return 'Very Unhealthy';
      case 6: return 'Hazardous';
      default: return 'Unknown';
    }
  }

  getAirQualityColor(index: number): string {
    switch (index) {
      case 1: return '#00e400';
      case 2: return '#ffff00';
      case 3: return '#ff7e00';
      case 4: return '#ff0000';
      case 5: return '#8f3f97';
      case 6: return '#7e0023';
      default: return '#666';
    }
  }

  getAlertSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'minor': return 'alert-minor';
      case 'moderate': return 'alert-moderate';
      case 'severe': return 'alert-severe';
      case 'extreme': return 'alert-extreme';
      default: return 'alert-unknown';
    }
  }
}