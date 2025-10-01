import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

// Services
import { CustomerPricingService } from './services/customer-pricing.service';
import { CatalogService, IdLabel, KeyLabel } from './services/catalog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatStepperModule
  ]
})
export class AppComponent implements OnInit {

  formStep1!: FormGroup;
  formStep2!: FormGroup;
  formStep3!: FormGroup;
  formStep4!: FormGroup;

  makes: IdLabel[] = [];
  models: IdLabel[] = [];
  interiorColors: KeyLabel[] = [];

  progress = 0;

  constructor(
    private fb: FormBuilder,
    private pricing: CustomerPricingService,
    private catalog: CatalogService
  ) {}

  ngOnInit(): void {
    this.formStep1 = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      month: [1, [Validators.min(1), Validators.max(12)]],
      day: [1, [Validators.min(1), Validators.max(31)]]
    });

    this.formStep2 = this.fb.group({
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{4,5}$/)]],
      category: ['', Validators.required],
      fuelType: ['', Validators.required],
      mileage: [0, [Validators.required, Validators.min(0)]]
    });

    this.formStep3 = this.fb.group({
      power: [null, [Validators.min(0)]],
      doorCount: [''],
      climatization: [''],
      color: [''],
      gearBox: [''],
      interiorType: [''],
      interiorColor: [''],
      seatCount: [null, [Validators.min(1), Validators.max(9)]],
      speedControl: [''],
      parkingAssistants: [[]],
      usedCarSeal: [''],
      trailerCouplingType: [''],
      slidingDoor: [''],
      radioTypes: [[]],
      daytimeRunningLamp: [''],
      bendingLightsType: [''],
      breakdownService: [''],
      emissionClass: [''],
      headlightType: [''],
      features: [[]]
    });

    this.formStep4 = this.fb.group({
      isRoadWorthy: [false],
      isAccidentDamaged: [false],
      isDamagedUnrepaired: [false],
      battery: [''],
      batteryCapacity: [''],
      emissionSticker: ['']
    });

    // Katalogdaten beim Start laden (Basic-Auth im Service/Environment)
    this.catalog.getMakes().subscribe(m => this.makes = m);

    [this.formStep1, this.formStep2, this.formStep3, this.formStep4].forEach(fg => {
      fg.valueChanges.subscribe(() => this.updateProgress());
    });
    this.updateProgress();
  }

  onMakeChange(makeId: number) {
    this.formStep1.get('model')?.reset();
    this.models = [];
    this.catalog.getModels(+makeId).subscribe(ms => this.models = ms);
  }

  onModelChange(modelId: number) {
    const makeId = +this.formStep1.get('make')?.value;
    if (!makeId || !modelId) { return; }
    this.catalog.getInteriorColors(makeId, +modelId).subscribe(cs => this.interiorColors = cs);
  }

  sendPricing() {
    const payload = this.buildVehicleJson();
    this.pricing.pricing(payload).subscribe();
  }

  resetAll() {
    this.formStep1.reset();
    this.formStep2.reset();
    this.formStep3.reset();
    this.formStep4.reset();
    this.progress = 0;
  }

  buildVehicleJson(): any {
    const d1 = this.formStep1.value;
    const d2 = this.formStep2.value;
    const d3 = this.formStep3.value;
    const d4 = this.formStep4.value;

    const firstRegistrationDate: any = {};
    if (d1.year) firstRegistrationDate.year = d1.year;
    if (d1.month) firstRegistrationDate.month = d1.month;
    if (d1.day) firstRegistrationDate.day = d1.day;

    return {
      makeId: d1.make,
      modelId: d1.model,
      zipCode: d2.zipCode,
      firstRegistrationDate,
      category: d2.category,
      fuelType: d2.fuelType,
      mileage: d2.mileage,
      ...d3,
      ...d4
    };
  }

  private updateProgress() {
    let done = 0;
    if (this.formStep1.get('make')?.valid) done++;
    if (this.formStep1.get('model')?.valid) done++;
    if (this.formStep1.get('year')?.valid) done++;
    if (this.formStep2.get('zipCode')?.valid) done++;
    if (this.formStep2.get('category')?.valid) done++;
    if (this.formStep2.get('fuelType')?.valid) done++;
    if (this.formStep2.get('mileage')?.valid) done++;
    this.progress = Math.round((done / 7) * 100);
  }
}
