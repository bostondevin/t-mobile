import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { CurrencyPipe } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { LSelect2Module } from 'ngx-select2'
import {
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule
} from '@angular/material'
import { NgxChartsModule } from '@swimlane/ngx-charts'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material'
import { RestangularModule } from 'ngx-restangular'
import { AppComponent } from './app.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
	  BrowserModule,
  	BrowserAnimationsModule,
  	FormsModule,
    FontAwesomeModule,
    LSelect2Module,
    MatFormFieldModule,
    MatInputModule,
  	NgxChartsModule,
    NgxDaterangepickerMd.forRoot(),
    ReactiveFormsModule,
    RestangularModule.forRoot()
  ],
  providers: [
  	CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
