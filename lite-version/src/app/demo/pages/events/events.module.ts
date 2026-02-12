import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../../../theme/shared/shared.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';

@NgModule({
  declarations: [
    EventListComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule
  ]
})
export class EventsModule { }
