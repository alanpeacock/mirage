import { Component, OnChanges, SimpleChange, Input, Output, AfterContentInit, EventEmitter } from "@angular/core";
import { GlobalShare } from "../../shared/globalshare.service";
declare var $: any;

@Component({
	selector: 'select2',
	templateUrl: './app/build/select2/select2.component.html',
	inputs: ["selectModal", "selectOptions", "querySelector", "selector", "showInfoFlag", "informationList", "passWithCallback", "searchOff"],
	providers: [GlobalShare]
})

export class select2Component implements OnChanges, AfterContentInit {
	@Input() querySelector;
	@Input() selector;
	@Input() showInfoFlag;
	@Input() passWithCallback: any;
	@Input() searchOff: boolean;
	@Output() callback = new EventEmitter();
	public select2Selector;
	@Input() informationList;
	constructor(private globalShare: GlobalShare) {}

	ngOnChanges() {}

	ngAfterContentInit() {
		console.log(this.informationList);
		setTimeout(function() {
			var select2Selector = $(this.querySelector).find('.' + this.selector).find('select');
			if(typeof this.passWithCallback != 'undefined') {
				select2Selector = $(this.querySelector).find('.' + this.selector+'-'+this.passWithCallback).find('select');	
			}
			this.setSelect2(select2Selector, function(val) {
				var obj: any = {
					val: val,
					selector: select2Selector
				};
				if(typeof this.passWithCallback != 'undefined') {
					obj.external = this.passWithCallback;
				}
				this.callback.emit(obj);
			}.bind(this));
		}.bind(this), 300);
	}

	setSelect2(field_select, callback) {
		var select2Option: any = {
			placeholder: "Select from the option"
		};
		if(this.searchOff) {
			select2Option.minimumResultsForSearch = -1;
		}
		field_select.select2(select2Option);
		field_select.on("change", function(e) {
			callback(field_select.val())
		}.bind(this));
		if (this.showInfoFlag) {
			field_select.on("select2:open", function(e) {
				setTimeout(function() {
					var selector = $('li.select2-results__option');
					selector.each(function(i, item) {
						var val = $(item).html();
						var info = this.getInformation(val);
						$(item).popover(info);
						$(item).on('shown.bs.popover', this.setLink)
						this.setLink();
					}.bind(this))
				}.bind(this), 300);
			}.bind(this));
		}
	}

	getInformation(query: any) {
		var query = this.informationList[query];
		query['html'] = true;
		query['trigger'] = 'click hover';
		query['placement'] = 'right';
		query['delay'] = {'show': 50, 'hide': 50};
		return query;
	}

	setLink() {
		setTimeout(function() {
			$('.popover a').unbind('click').on('click',function(event) {
				event.preventDefault();
				var link = $(this).attr('href');
				window.open(link, '_blank');
			});
		}, 500);
	}

}