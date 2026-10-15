import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Pollution, PollutionType } from '../../models/pollution.model';

const TYPE_CLASSES: Record<PollutionType, string> = {
  Plastique: 'tag-plastique',
  Chimique: 'tag-chimique',
  'Dépôt sauvage': 'tag-depot',
  Eau: 'tag-eau',
  Air: 'tag-air',
  Autre: 'tag-autre',
};

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap {
  @Input({ required: true }) pollution!: Pollution;
  @Output() readonly newDeclaration = new EventEmitter<void>();

  protected readonly photoFailed = signal(false);

  protected get typeClass(): string {
    return TYPE_CLASSES[this.pollution.type];
  }

  protected get mapUrl(): string {
    const { latitude: lat, longitude: lon } = this.pollution;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  }
}
