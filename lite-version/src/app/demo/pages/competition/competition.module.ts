// src/app/demo/pages/competition/competition.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CompetitionListComponent } from './competition-list.component';

const routes: Routes = [
  {
    path: '',
    component: CompetitionListComponent
  }
];

@NgModule({
  declarations: [CompetitionListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CompetitionModule {}
