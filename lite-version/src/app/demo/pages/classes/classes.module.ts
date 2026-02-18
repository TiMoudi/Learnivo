// src/app/demo/pages/classes/classes.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ClasseListComponent } from './classe-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClasseListComponent
  }
];

@NgModule({
  declarations: [ClasseListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ClassesModule {}
