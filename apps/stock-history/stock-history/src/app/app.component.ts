import { Component, OnDestroy } from '@angular/core'
import { CurrencyPipe } from '@angular/common'
import { Subscription } from 'rxjs'
import { FormBuilder, FormGroup, FormControl } from '@angular/forms'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { RestangularModule, Restangular } from 'ngx-restangular'
import * as moment from 'moment'

@Component({
  selector: 't-mobile-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

	title = 'Stock History'

	alphaVantageApiKey = '7YUQIB7009CDZVQQ'
	searchText: string
	stockPickerForm: FormGroup
	searchOptions: any = []
	isSameDay: boolean
	rendering: boolean = false
	startDate: Date
	endDate: Date
	chartData: any
	selectedSymbol: any
	today: string
	searchSubscription: Subscription
	stockLookupSubscription: Subscription

	ranges: any = {
	  'Today': [moment(), moment()],
	  // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	  'Last Business Day': [[1, 2, 3, 4, 5].indexOf(moment().subtract(1, 'day').day()) > -1 ? 
	    moment().subtract(1, 'day') : moment(moment().day(-2)), moment()],
	  'Last Week': [moment().subtract(6, 'days'), moment()],
	  'Last 1 Month': [moment().subtract(1, 'month'), moment()],
	  'Last 3 Months': [moment().subtract(3, 'month'), moment()],
	  'Last 6 Months': [moment().subtract(6, 'month'), moment()],
	  'Last Year': [moment().subtract(1, 'year'), moment()],
	  'Last 3 Years': [moment().subtract(3, 'year'), moment()],
	  'Last 5 Years': [moment().subtract(5, 'year'), moment()],
	  'Last 10 Years': [moment().subtract(10, 'year'), moment()]
	}

	constructor(
			private restangular: Restangular,
			private cp: CurrencyPipe
		) {

		library.add(fas)

		let date = new Date()
		this.today = date.toISOString()

		this.stockPickerForm = new FormGroup({
	       symbol: new FormControl(),
	       timeframe: new FormControl()
	    })

	}

	dateXTickFormatting(val: any): string {
		//if (this.isSameDay)
			//return val.toLocaleString('en-US').split(', ')[1]
		//else
			//return val.toLocaleString('en-US').split(',')[0]
		return val.toLocaleString('en-US').substr(0, val.toLocaleString('en-US').length - 6)

	}

	dateYTickFormatting(val: any): string {
		if (this.cp)
			return this.cp.transform(val, 'USD')
		else
			return '$' + val + '.00'
	}

	selectSymbol(item: any){
		this.selectedSymbol = item
		this.searchText = null
		this.searchOptions = []

		if (this.startDate && this.endDate)
			this.renderGraph()
	}

	formatDateTime(input: string){
		const dateTimeParts = input.split(' ')
		const dateParts = dateTimeParts[0].split('-')
		if (dateTimeParts.length === 2){
			const timeParts = dateTimeParts[1].split(':')
			return new Date(
				parseInt(dateParts[0]), 
				parseInt(dateParts[1])-1, 
				parseInt(dateParts[2]), 
				parseInt(timeParts[0]), 
				parseInt(timeParts[1]), 
				parseInt(timeParts[2])
			)
		} else {
			return new Date(
				parseInt(dateParts[0]), 
				parseInt(dateParts[1])-1, 
				parseInt(dateParts[2])
			)
		}
	}

	dateRangeChange(e: any){
		if (e.startDate && e.endDate){
			this.startDate = e.startDate.toDate()
			this.endDate = e.endDate.toDate()
			this.isSameDay = (
				this.startDate.getDate() == this.endDate.getDate() &&
				this.startDate.getMonth() == this.endDate.getMonth() &&
				this.startDate.getFullYear() == this.endDate.getFullYear()
			)
			this.renderGraph()
		}
	}

	renderGraph(){

		this.rendering = true

		const query = {
  			function: this.isSameDay ? 'TIME_SERIES_INTRADAY' : 'TIME_SERIES_DAILY', 
  			symbol: this.selectedSymbol['1. symbol'], 
  			apikey: this.alphaVantageApiKey,
  			outputsize: 'full'
  		}

		if (this.isSameDay)
			query['interval'] = '5min'

  		this.searchSubscription = this.stockService('query', query).subscribe((data: any) => {
  			if (data.Note)
  				alert(data.Note)
  			else {

	  			let series = data[this.isSameDay ? 'Time Series ('+ query['interval'] +')' : 'Time Series (Daily)']

	  			if (series){
		
		  			const chartData = []

	  				for (let key of Object.keys(series))
						if (
							this.formatDateTime(key).getTime() >= this.startDate.getTime() && 
							this.formatDateTime(key).getTime() <= this.endDate.getTime()
						){
							chartData.push({
								name: this.formatDateTime(key),
								value: series[key]['4. close']
							})
						}

		  			this.chartData = [
					  {
					    name: "Stock Price",
					    series: chartData
					  }
					]
	  			}
  			}
  			this.rendering = false
		})

	}

	symbolSearchChange(e: any){
  		this.searchSubscription = this.stockService('query', {
  			function: 'SYMBOL_SEARCH', 
  			keywords: this.searchText, 
  			apikey: this.alphaVantageApiKey
  		}).subscribe((data: any) => {
			this.searchOptions = data.bestMatches
		})
	}

  	stockService(url: string, params: any) {
		return this.restangular.oneUrl(url, 'https://www.alphavantage.co/' + url).get(params)
  	}

	ngOnDestroy() {
		if (this.searchSubscription) this.searchSubscription.unsubscribe()
		if (this.stockLookupSubscription) this.stockLookupSubscription.unsubscribe()
	}

}
