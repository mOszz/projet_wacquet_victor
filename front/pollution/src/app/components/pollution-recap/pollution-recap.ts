import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { POLLUTION_TYPE_TAGS, Pollution } from '../../models/pollution.model';

@Component({
  selector: 'app-pollution-recap',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css',
})
export class PollutionRecap {
  @Input({ required: true }) pollution!: Pollution;
  @Input() heading = 'Déclaration enregistrée';

  protected readonly photoFailed = signal(false);

  protected get typeClass(): string {
    return POLLUTION_TYPE_TAGS[this.pollution.type];
  }

  protected get mapUrl(): string {
    const { latitude: lat, longitude: lon } = this.pollution;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  }
}
