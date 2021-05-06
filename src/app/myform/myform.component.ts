import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import {SearchForm1} from '../search-form1';
import { Injectable } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import {trigger,state,style,transition,animate} from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as $ from 'jquery';







@Component({
  selector: 'app-myform',
  templateUrl: './myform.component.html',
  styleUrls: ['./myform.component.css'],
  animations:[
  	trigger('searchFlyInNOut',
	  	[
	  		state('resultIn',style({transform: 'translateX(0)'})),
	  		state('detailIn',style({transform: 'translateX(100%)', display: 'none'})),

	  		transition('resultIn <=> detailIn',[animate('0.5s')])
	  	]
  	),
  	trigger('detailFlyInNOut',
	  	[
	  		state('resultIn',style({transform: 'translateX(-100%)', display: 'none'})),
	  		state('detailIn',style({transform: 'translateX(0)'})),

	  		transition('resultIn <=> detailIn',[animate('0.5s')])
	  	]
  	)
  ]
})
@Injectable()
export class MyformComponent implements OnInit {
	

	cates = ['All Categories','Art','Baby','Books','Clothing, Shoes & Accessories','Computers/Tablets & Networking','Health & Beauty','Music','Video Games & Consoles'];

	model = new SearchForm1("",this.cates[0], 10, false, false, false, false, false, true, false,'');

	none = 'N/A';
	options: number[]=[];
	p: number = 1;
	

	public currentId;
	
	rows = [];
	titles = [];
	galleryURL = [];
	sellPrice = [];
	shipPrice = [];
	sellZip = [];
	seller = [];
	notWish = [];
	ids = [];
	cart = [];
	wishItems = [];
	wishCounter = 1;
	totalPrice = 0;
	thePattern = '^[0-9]{5}$';
	zipDisable = true;
	detailDisabled = true;
	highlight = '';
	theZip = '';
	hideResult = true;
	markedId = 0;
	visDetail = 'resultIn';
	notHavingDetails = true;
	detailTitle = '';
	detailResponse = [];
	orderChoice = 'Default';
	orderOrder = 'Ascending';
	hideProd = true;
	hidePhoto = true;
	hideShip = true;
	hideSeller = true;
	hideSim = true;
	haveShipCost = false;
	haveShipLoc = false;
	haveHandTime = false;
	haveExpShip = false;
	haveOneDay = false;
	haveReturn = false;
	haveForm = true;
	haveSellerTitle = false;
	haveFeedBackScore = false;
	havePopularity = false;
	haveFeedBackRating = false;
	haveTopRated = false;
	haveStoreName = false;
	haveStoreURL = false;
	haveSimItem = false;
	haveSimResult = false;
	haveLess = true; 
	shooting = false;
	havePics = false;
	noMoreSim = true;
	noDetErr = false;
	noPhotos = false;
	noShips = false;
	noSeller = false;
	simProducts = [];
	detNames = [];
	detValues = [];
	bigPhotoURL = [];
	isDefault = true;
	hideProgBar = true;
	shareFBURL = '';
	valve = 5;
	markedIndex = 50;
	max = 100;

	radius = 25;
	stroke = 5;
	circleColor ='#009933';
	sellerDetails = {
		title: "",
		score: "",
		pop: 0,
		rateColor: "",
		topR: false,
		storeName: "",
		storeURL: "",
	}
	detailPicURL = [];
	shipDetails = {
		cost: "",
		loc: "",
		time: "",
		expShip: true,
		oneDay: true,
		returnAcpt: true
	}

	getOverlayStyle() {
	    let isSemi = false;
	    let transform = (isSemi ? '' : 'translateY(140%) ') + 'translateX(3%)';
 
	    return {
	      'transform': transform,
	      '-moz-transform': transform,
	      '-webkit-transform': transform,
	      'font-size': this.radius / 1.5 + 'px'
		};
	}

	onSubmit(){
		
		var url = "/getItemsJson?keyword=" + this.model.keyword;
		if(this.model.category != undefined){
			url += "&category=";
			var cateNospace = this.model.category.replace(/ /g, '');
			url += cateNospace;
		}
		if(this.model.newProd == true){
			url += "&condition1=";
			url += "new";
		}
		if(this.model.used == true){
			url += "&condition2=";
			url += "used";
		}

		if(this.model.unspecified == true){
			url += "&condition3=";
			url += "unspecified";
		}
		if(this.model.locPick == true){
			url += "&shipping1=";
			url +=	"local";
		}
		if(this.model.freeShip == true){
			url += "&shipping2=";
			url += "free";
		}
		if(this.model.distance != undefined){
			url += "&distance=";
			url += String(this.model.distance);
		}
		if(this.model.zip != undefined){
			if(this.model.zip == ''){
				url += "&zip=";
				this.model.zip = this.theZip;
				url += String(this.model.zip);
			}
			else{
				url += "&zip=";
				url += String(this.model.zip);
			}
		}
		/**if(this.model.currLoc == true){
			url += "&current=";
			url += "yes";
		}
		if(this.model.other == true){
			url += "&other=";
			url += "yes";
		}*/

		/**console.log(url);*/
		this.hideProgBar = false;
		
		var hello = this.http.get(url).subscribe((response: any) => {
      		/**console.log(response);*/
      			this.rows = [];
				this.titles = [];
				this.galleryURL = [];
				this.sellPrice = [];
				this.shipPrice = [];
				this.sellZip = [];
				this.seller = [];
				this.notWish = [];
				this.ids = [];
				this.p = 1;
      		if(response.findItemsAdvancedResponse[0].searchResult != null && response.findItemsAdvancedResponse[0].searchResult != undefined){
      			
  				if(response.findItemsAdvancedResponse[0].searchResult[0].item == undefined){
  					$('#noResponse').show();
  					$('#totalTable').hide();
  				}
  				else{
  					this.rows = response.findItemsAdvancedResponse[0].searchResult[0].item;
  					/**console.log(this.rows);*/
  					var items = response.findItemsAdvancedResponse[0].searchResult[0].item;
  					$('#noResponse').hide();
  					var content = '';
  					
  					for(var i = 0; i < items.length; i++){
  						/**this.rows.push(i);*/
  						this.ids.push(items[i].itemId[0]);
  						if(items[i].title[0] != null && items[i].title[0] != undefined){
  							if(items[i].title[0].length <= 35){
  								this.titles.push(items[i].title[0]);
  							}
  							else{
  								var theTitle = items[i].title[0].substring(0,35);
  								theTitle += '...';
  								this.titles.push(theTitle);
  							}
  						}
  						else{
  							this.titles.push('N/A');
  						}
  						if(items[i].sellingStatus[0] != null && items[i].sellingStatus[0] != undefined && items[i].sellingStatus[0].currentPrice != null && items[i].sellingStatus[0].currentPrice != undefined && items[i].sellingStatus[0].currentPrice[0] != null && items[i].sellingStatus[0].currentPrice[0] != undefined && items[i].sellingStatus[0].currentPrice[0].__value__ != undefined){
  							this.sellPrice.push('$' + String(items[i].sellingStatus[0].currentPrice[0].__value__));
  						}
  						else{
  							this.sellPrice.push('N/A');
  						}
  						if(items[i].shippingInfo != undefined && items[i].shippingInfo[0] != undefined && items[i].shippingInfo[0].shippingServiceCost != undefined && items[i].shippingInfo[0].shippingServiceCost[0] != undefined && items[i].shippingInfo[0].shippingServiceCost[0].__value__ != undefined){
  							if(items[i].shippingInfo[0].shippingServiceCost[0].__value__ > 0){
  								this.shipPrice.push('$' + String(items[i].shippingInfo[0].shippingServiceCost[0].__value__));
  							}
  							else{
  								this.shipPrice.push('Free Shipping');
  							}
  						}
  						else{
  							this.shipPrice.push('N/A');
  						}
  						if(items[i].postalCode != undefined && items[i].postalCode[0] != undefined){
  							this.sellZip.push(items[i].postalCode);
  						}
  						else{
  							this.sellZip.push('N/A');
  						}
  						if(items[i].sellerInfo != undefined && items[i].sellerInfo[0] != undefined && items[i].sellerInfo[0].sellerUserName != undefined && items[i].sellerInfo[0].sellerUserName[0] != undefined){
  							this.seller.push(items[i].sellerInfo[0].sellerUserName[0]);
  						}
  						else{
  							this.seller.push('N/A');
  						}
  						this.notWish.push(true);
  						for(var j= 0;j < this.wishItems.length;j++){
  							if(this.wishItems[j].id == items[i].itemId[0]){
  								this.notWish.pop();
  								this.notWish.push(false);
  							}
  						}

  					}
  					$('#totalTable').show();
  					this.hideProgBar = true;
  					this.hideResult = false;
  					if(this.model.zip == this.theZip ){
  						this.model.zip = "";
  					}
  				}
      		}	
      	});
	}


	markDetail(num){
		this.currentId = this.rows[num - 1].itemId[0];
		this.detailDisabled = false;
		this.markedId = this.rows[num - 1].itemId[0];
	}

	markWishDetail(num){
		this.detailDisabled = false;
		this.markedId = this.wishItems[num].id;
		this.highlight = this.wishItems[num].id;
	}
	searchDetail(id){
		this.showProdDetail(id);
 		this.visDetail = 'detailIn';
 		this.notHavingDetails = false;
	}

	backToResult(){
		this.visDetail = 'resultIn';
		this.notHavingDetails = true;
	}

	showProdDetail(markedId){
		$('#navProd').removeClass('nav-link').addClass('nav-link active');
		$('#navShip').removeClass('nav-link active').addClass('nav-link');	
		$('#navPhoto').removeClass('nav-link active').addClass('nav-link');
		$('#navSell').removeClass('nav-link active').addClass('nav-link');
		$('#navSim').removeClass('nav-link active').addClass('nav-link');
		/**console.log(markedId);*/
		var indx = this.ids.indexOf(markedId);
		/**console.log(indx);*/
		this.detailDisabled = false;
		this.detailPicURL = [];
		
		this.markedIndex = indx + 1;
		this.detailTitle = '';
		var detailSearch = "/detail?id=" + markedId;
		this.hideProgBar = false;
 		this.http.get(detailSearch).subscribe((response: any)=>{
 			/**console.log(response);*/
 			this.detailResponse.push(response);
 			this.detailTitle = this.rows[indx].title[0];
 			this.detNames = [];
			this.detValues = [];
 			if(response.Item != undefined){

	 			var theItem = response.Item;
	 			if( theItem.PictureURL != undefined){
	 				this.havePics = true;
	 				this.detailPicURL = theItem.PictureURL;
	 			}
	 			else{
	 				this.havePics = false;
	 			}
	 			if(theItem.Subtitle != undefined){
	 				this.detNames.push('Subtitle');
	 				this.detValues.push(theItem.Subtitle);
	 			}
	 			else{
	 			}
	 			if(theItem.CurrentPrice != undefined && theItem.CurrentPrice.Value != undefined){
	 				this.detNames.push('Price');
	 				var price = '$' + String(theItem.CurrentPrice.Value);
	 				this.detValues.push(price);
	 			}
	 			else{
	 			}
	 			if(theItem.Location != undefined){
	 				this.detNames.push('Location');
	 				this.detValues.push(theItem.Location);
	 			}
	 			else{
	 			}
	 			if(theItem.ReturnPolicy != undefined){
	 				this.detNames.push('Return Policy');
	 				var returnPol = '';
	 				if(theItem.ReturnPolicy.ReturnsAccepted != undefined){
	 					returnPol += theItem.ReturnPolicy.ReturnsAccepted;
	 					if(theItem.ReturnPolicy.ReturnsWithin != undefined){
	 						returnPol += ' in ';
	 						returnPol += theItem.ReturnPolicy.ReturnsWithin;
	 					}
	 				}
	 				this.detValues.push(returnPol);
	 			}
	 			else{
	 			}
	 			if(theItem.ItemSpecifics != undefined && theItem.ItemSpecifics.NameValueList != undefined){
	 				for(var i = 0;i < theItem.ItemSpecifics.NameValueList.length;i++){
	 					this.detNames.push(theItem.ItemSpecifics.NameValueList[i].Name);
	 					if(theItem.ItemSpecifics.NameValueList[i].Value != undefined && theItem.ItemSpecifics.NameValueList[i].Value[0] != undefined){
	 						this.detValues.push(theItem.ItemSpecifics.NameValueList[i].Value[0]);
	 					}
	 					else{
	 						this.detValues.push('N/A');
	 					}
	 				}
	 			}
	 			this.hideProd = false;
	 			this.noDetErr = false;
	 			this.noSeller = false;
	 			this.shareFBURL = 'https://www.facebook.com/sharer/sharer.php?u=' + theItem.ViewItemURLForNaturalSearch + '&quote=' + 'Buy ' + this.detailTitle + ' at $' + String(theItem.CurrentPrice.Value) + ' from link below.';
	 		}
	 		else{
	 			/**Error handling.*/
	 			this.noDetErr = true;
	 			this.noSeller = true;
	 		}

 		});

 		this.hideSeller = true;
		this.hideProd = false;
		this.hidePhoto = true;
		this.hideShip = true;
		this.hideSim = true;
		this.hideProgBar = true;
	}

	showPhoto(markedId){
		$('#navProd').removeClass('nav-link active').addClass('nav-link');
		$('#navShip').removeClass('nav-link active').addClass('nav-link');	
		$('#navPhoto').removeClass('nav-link').addClass('nav-link active');
		$('#navSell').removeClass('nav-link active').addClass('nav-link');
		$('#navSim').removeClass('nav-link active').addClass('nav-link');	
		var indx = this.ids.indexOf(markedId);
		this.bigPhotoURL = [];
		var prodTitle = this.rows[indx].title[0];
		var phoSearch = "/photoSearch?prod=" + prodTitle;
		this.hideProgBar = false;
 		this.http.get(phoSearch).subscribe((response: any)=>{
 			/**console.log(response);*/
 			if(response.items != undefined){
 				for(var i = 0;i < response.items.length;i++){
 					this.bigPhotoURL.push(response.items[i].link);
 				}
 				this.noPhotos = false;
 			}
 			else{
 				this.noPhotos = true;
 			}
 			this.hideProgBar = true;
 		});
 		this.hideSeller = true;
		this.hideProd = true;
		this.hidePhoto = false;
		this.hideShip = true;
		this.hideSim = true;
		
	}

	showShipDetail(num){
		var indx = this.ids.indexOf(num);
		this.haveShipCost = false;
		this.haveShipLoc = false;
		this.haveHandTime = false;
		this.haveExpShip = false;
		this.haveOneDay = false;
		this.haveReturn = false;
		
		$('#navProd').removeClass('nav-link active').addClass('nav-link');
		$('#navShip').removeClass('nav-link').addClass('nav-link active');	
		$('#navPhoto').removeClass('nav-link active').addClass('nav-link');
		$('#navSell').removeClass('nav-link active').addClass('nav-link');
		$('#navSim').removeClass('nav-link active').addClass('nav-link');
		this.hideShip = false;
		if(this.rows[indx].shippingInfo != undefined){
			
			if(this.rows[indx].shippingInfo[0] != undefined){
				var currShipping = this.rows[indx].shippingInfo[0];
				if(this.shipPrice[indx] != 'N/A'){
					this.shipDetails.cost = this.shipPrice[indx];
					this.haveShipCost = true;
				}
				if(currShipping.shipToLocations != undefined && currShipping.shipToLocations[0] != undefined){
					this.shipDetails.loc = currShipping.shipToLocations[0];
					this.haveShipLoc = true;
				}
				if(currShipping.handlingTime != undefined && currShipping.handlingTime[0] != undefined){
					var timeCount = parseInt(currShipping.handlingTime[0]);
					if(timeCount > 1){
						this.shipDetails.time = currShipping.handlingTime[0] + ' Days';
					}
					else{
						this.shipDetails.time = currShipping.handlingTime[0] + ' Day';
					}
					this.haveHandTime = true;
				}
				if(currShipping.expeditedShipping != undefined && currShipping.expeditedShipping[0] != undefined){
					if(currShipping.expeditedShipping[0] == "false"){
						this.shipDetails.expShip = false;
					}
					else{
						this.shipDetails.expShip = true;
					}
					this.haveExpShip = true;
				}
				if(currShipping.oneDayShippingAvailable != undefined && currShipping.oneDayShippingAvailable[0] != undefined){
					if(currShipping.oneDayShippingAvailable[0] == "false"){
						this.shipDetails.oneDay= false;
					}
					else{
						this.shipDetails.oneDay = true;
					}
					this.haveOneDay = true;
				}
				if(this.rows[indx].returnsAccepted != undefined && this.rows[indx].returnsAccepted[0] != undefined){
					if(this.rows[indx].returnsAccepted[0] == "false"){
						this.shipDetails.returnAcpt = false;
					}
					else{
						this.shipDetails.returnAcpt = true;
					}
					this.haveReturn = true;
				}
			}
			this.noShips = false;
		}
		else{
			this.noShips = true;
		}
		this.hideSeller = true;
		this.hideProd = true;
		this.hidePhoto = true;
		this.hideShip = false;
		this.hideSim = true;
	}


	showSellerDetail(markedId){
		$('#navProd').removeClass('nav-link active').addClass('nav-link');
		$('#navShip').removeClass('nav-link active').addClass('nav-link');	
		$('#navPhoto').removeClass('nav-link active').addClass('nav-link');
		$('#navSell').removeClass('nav-link').addClass('nav-link active');
		$('#navSim').removeClass('nav-link active').addClass('nav-link');
		var indx = this.ids.indexOf(markedId);

		this.haveSellerTitle = false;
		this.haveFeedBackScore = false;
		this.havePopularity = false;
		this.haveFeedBackRating = false;
		this.haveTopRated = false;
		this.haveStoreName = false;
		this.haveStoreURL = false;
		if(this.detailResponse[0].Item != undefined && this.detailResponse[0].Item.Seller != undefined && this.detailResponse[0].Item.Seller.UserID != undefined){
			this.haveSellerTitle = true;

			this.sellerDetails.title = this.detailResponse[0].Item.Seller.UserID ;

		}

		if(this.rows[indx].sellerInfo != undefined && this.rows[indx].sellerInfo[0] != undefined && this.rows[indx].sellerInfo.feedbackScore != undefined && this.rows[indx].sellerInfo[0].feedbackScore[0] != undefined){
			this.haveFeedBackScore = true;
			this.sellerDetails.score = this.rows[indx].sellerInfo[0].feedbackScore[0];

		}
		if(this.rows[indx].sellerInfo != undefined && this.rows[indx].sellerInfo[0] != undefined && this.rows[indx].sellerInfo[0].feedbackScore != undefined && this.rows[indx].sellerInfo[0].feedbackScore[0] != undefined){
			this.haveFeedBackScore = true;
			this.sellerDetails.score = this.rows[indx].sellerInfo[0].feedbackScore[0];
		}
		if(this.rows[indx].sellerInfo != undefined && this.rows[indx].sellerInfo[0] != undefined && this.rows[indx].sellerInfo[0].positiveFeedbackPercent != undefined && this.rows[indx].sellerInfo[0].positiveFeedbackPercent[0] != undefined){
			this.havePopularity = true;
			this.sellerDetails.pop = parseFloat(this.rows[indx].sellerInfo[0].positiveFeedbackPercent[0]);
			
		}
		if(this.rows[indx].sellerInfo != undefined && this.rows[indx].sellerInfo[0] != undefined && this.rows[indx].sellerInfo[0].feedbackRatingStar != undefined && this.rows[indx].sellerInfo[0].feedbackRatingStar[0] != undefined){
			this.haveFeedBackRating = true;
			var intScore = parseFloat(this.sellerDetails.score);
			
			if(intScore >= 10000){
				this.shooting = true;
				var colorCheck = this.rows[indx].sellerInfo[0].feedbackRatingStar[0].replace("Shooting","");
				this.sellerDetails.rateColor = colorCheck;
			
			}
			else{
				this.shooting = false;
				var colorCheck = this.rows[indx].sellerInfo[0].feedbackRatingStar[0];
				this.sellerDetails.rateColor = colorCheck;
			}
		}
		if(this.rows[indx].sellerInfo != undefined && this.rows[indx].sellerInfo[0] != undefined && this.rows[indx].sellerInfo[0].topRatedSeller != undefined && this.rows[indx].sellerInfo[0].topRatedSeller[0] != undefined){
			this.haveTopRated = true;
			if(this.rows[indx].sellerInfo[0].topRatedSeller[0] == "true"){
				this.sellerDetails.topR = true;
			}
			else{
				this.sellerDetails.topR = false;
			}
		}

		if(this.rows[indx].storeInfo != undefined && this.rows[indx].storeInfo[0] != undefined && this.rows[indx].storeInfo[0].storeName != undefined && this.rows[indx].storeInfo[0].storeName[0] != undefined){
			this.haveStoreName = true;
			this.sellerDetails.storeName = this.rows[indx].storeInfo[0].storeName[0];
		}
		if(this.rows[indx].storeInfo != undefined && this.rows[indx].storeInfo[0] != undefined && this.rows[indx].storeInfo[0].storeURL != undefined && this.rows[indx].storeInfo[0].storeURL[0] != undefined){
			this.haveStoreURL = true;
			this.sellerDetails.storeURL= this.rows[indx].storeInfo[0].storeURL[0];
		}

		this.hideSeller = false;
		this.hideProd = true;
		this.hidePhoto = true;
		this.hideShip = true;
		this.hideSim = true;
	}

	showSimilarProd(markedId){
		$('#navProd').removeClass('nav-link active').addClass('nav-link');
		$('#navShip').removeClass('nav-link active').addClass('nav-link');	
		$('#navPhoto').removeClass('nav-link active').addClass('nav-link');
		$('#navSell').removeClass('nav-link active').addClass('nav-link');
		$('#navSim').removeClass('nav-link').addClass('nav-link active');

		var indx = this.ids.indexOf(markedId);
		/**console.log(markedId); */
		var simSearch = "/simSearch?searchId=" + markedId;
		this.hideProgBar = false;
 		this.http.get(simSearch).subscribe((response: any)=>{
 			
 			var simResponse = JSON.parse(response);
 			

			if(simResponse.getSimilarItemsResponse.itemRecommendations != undefined && simResponse.getSimilarItemsResponse.itemRecommendations.item != undefined){
				var items = simResponse.getSimilarItemsResponse.itemRecommendations.item;
				this.haveSimItem = true;

				for(var i = 0; i < items.length;i++){
				 	var	simProd = {
						name: "",
						url: "",
						price: 0,
						priceStr: "",
						shipCost: 0,
						shipStr: "",
						dayLeft: 0,
						picURL: "",
					}
					if(items[i].imageURL != undefined){
						simProd.picURL = items[i].imageURL;
					}
					else{
						simProd.picURL = "";
					}
					if(items[i].title != undefined){

						simProd.name = items[i].title;
						if(items[i].viewItemURL != undefined){
							simProd.url = items[i].viewItemURL;
						}
						else{
							simProd.url = '';
						}	
					}
					else{
						simProd.name = '';
						simProd.url = '';
					}
					if(items[i].buyItNowPrice != undefined && items[i].buyItNowPrice.__value__ != undefined){
						simProd.priceStr = items[i].buyItNowPrice.__value__;
						simProd.price = parseFloat(items[i].buyItNowPrice.__value__);
					}
					else{
						simProd.price = -1;
					}
					
					if(items[i].shippingCost != undefined && items[i].shippingCost.__value__ != undefined){
						simProd.shipStr = items[i].shippingCost.__value__;
						simProd.shipCost = parseFloat(items[i].shippingCost.__value__);
					}
					else{
						simProd.shipCost = -1;
					}
					
					if(items[i].timeLeft != undefined){
						var dayStr = items[i].timeLeft;
						var posP = dayStr.indexOf('P');
						var posD = dayStr.indexOf('D');
						dayStr = dayStr.substr(posP + 1,posD - 1);
						simProd.dayLeft = parseInt(dayStr);
					}
					else{
						simProd.dayLeft = -1;
					}
					this.simProducts.push(simProd);

					if(this.simProducts.length > 5){
						this.noMoreSim = false;
					}
					else{
						this.noMoreSim = true;
					}
				}
				this.haveSimResult = true;

					
			}
			else{
				this.haveSimResult = false;
			}
			this.hideProgBar = true;
 		});

		this.hideSeller = true;
		this.hideProd = true;
		this.hidePhoto = true;
		this.hideShip = true;
		this.hideSim = false;
		
	}

	changeOrder(orders){
		if(this.orderChoice != 'Default'){
			this.isDefault = false;
		}
		else{
			this.isDefault = true;
		}
		if(orders == 'Ascending'){
			if(this.orderChoice == 'Product Name'){

				this.simProducts.sort((a,b): number =>{
					var propA = a.name.toUpperCase();
					var propB = b.name.toUpperCase();
					
					if(propA > propB){
						return 1;
					}
					else if(propA < propB){
						return -1;
					}
					return 0;
				});

			}
			else if(this.orderChoice == 'Days Left'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.dayLeft;
					var propB = b.dayLeft;
					
					if(propA > propB){
						return 1;
					}
					else if(propA < propB){
						return -1;
					}
					return 0;
				});

			}
			else if(this.orderChoice == 'Price'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.price;
					var propB = b.price;
					
					if(propA > propB){
						return 1;
					}
					else if(propA < propB){
						return -1;
					}
					return 0;
				});
			}
			else if(this.orderChoice == 'Shipping Cost'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.shipCost;
					var propB = b.shipCost;
					if(propA > propB){
						return 1;
					}
					else if(propA < propB){
						return -1;
					}
					return 0;
				});
			}
		}
		else if(orders == 'Descending'){
			if(this.orderChoice == 'Product Name'){

				this.simProducts.sort((a,b): number =>{
					var propA = a.name.toUpperCase();
					var propB = b.name.toUpperCase();
					
					if(propA < propB){
						return 1;
					}
					else if(propA > propB){
						return -1;
					}
					return 0;
				});

			}
			else if(this.orderChoice == 'Days Left'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.dayLeft;
					var propB = b.dayLeft;
					
					if(propA < propB){
						return 1;
					}
					else if(propA > propB){
						return -1;
					}
					return 0;
				});

			}
			else if(this.orderChoice == 'Price'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.price;
					var propB = b.price;
					
					if(propA < propB){
						return 1;
					}
					else if(propA > propB){
						return -1;
					}
					return 0;
				});
			}
			else if(this.orderChoice == 'Shipping Cost'){
				this.simProducts.sort((a,b): number =>{
					var propA = a.shipCost;
					var propB = b.shipCost;
					if(propA < propB){
						return 1;
					}
					else if(propA > propB){
						return -1;
					}
					return 0;
				});
			}
		}
	}

	showMore(){
		this.valve = 20;
		this.haveLess = false;
	}

	showLess(){
		this.valve = 5;
		this.haveLess = true;
	}



	clearAll(){

		this.model = new SearchForm1("",this.cates[0], 10, false, false, false, false, false, false, false,'');
		this.zipDisable = true;
		$('#ctrlButtons').hide();
		$('#noResponse').hide();
		$('#totalTable').hide();
		$('#wishTable').hide();

		this.thePattern = '^[0-9]{5}$';
		this.rows = [];
		this.titles = [];
		this.galleryURL = [];
		this.sellPrice = [];
		this.shipPrice = [];
		this.sellZip = [];
		this.seller = [];
		
		this.ids = [];
		
		this.zipDisable = true;
		this.detailDisabled = true;
		this.highlight = '';
		this.theZip = '';
		this.hideResult = true;
		this.markedId = 0;
		this.visDetail = 'resultIn';
		this.notHavingDetails = true;
		this.detailTitle = '';
		this.detailResponse = [];
		this.orderChoice = 'Default';
		this.orderOrder = 'Ascending';
		this.hideProd = true;
		this.hidePhoto = true;
		this.hideShip = true;
		this.hideSeller = true;
		this.hideSim = true;
		this.haveShipCost = false;
		this.haveShipLoc = false;
		this.haveHandTime = false;
		this.haveExpShip = false;
		this.haveOneDay = false;
		this.haveReturn = false;
		
		this.haveSellerTitle = false;
		this.haveFeedBackScore = false;
		this.havePopularity = false;
		this.haveFeedBackRating = false;
		this.haveTopRated = false;
		this.haveStoreName = false;
		this.haveStoreURL = false;
		this.haveSimItem = false;
		this.haveSimResult = false;
		this.haveLess = true; 
		this.shooting = false;
		this.havePics = false;
		this.noMoreSim = true;
		this.noDetErr = false;
		this.noPhotos = false;
		this.noShips = false;
		this.noSeller = false;
		this.simProducts = [];
		this.detNames = [];
		this.detValues = [];
		this.bigPhotoURL = [];
		this.isDefault = true;
		this.hideProgBar = true;
		this.shareFBURL = '';
		this.valve = 5;
		this.markedIndex = 50;
		this.max = 100;

		this.radius = 25;
		this.stroke = 5;
		this.circleColor ='#009933';
		this.sellerDetails = {
			title: "",
			score: "",
			pop: 0,
			rateColor: "",
			topR: false,
			storeName: "",
			storeURL: "",
		}
		this.detailPicURL = [];
		this.shipDetails = {
			cost: "",
			loc: "",
			time: "",
			expShip: true,
			oneDay: true,
			returnAcpt: true
		}

	}

	addItem(itemNum){
		var num = itemNum - 1;
		var theItem = {
			galleryURL: this.rows[num].galleryURL[0],
			title: this.titles[num],
			fullTitle: this.rows[num].title[0],
			price: this.sellPrice[num],
			ships: this.shipPrice[num],
			seller: this.seller[num],
			id: this.ids[num],
		}
		this.wishItems.push(theItem);
		
		this.notWish[itemNum - 1] = false;
		var imageStr = this.ids[num] + 'gurl';
		var titleStr = this.ids[num] + 'title';
		var priceStr = this.ids[num] + 'price';
		var shipStr = this.ids[num] + 'ship';
		var sellerStr = this.ids[num] + 'seller';
		localStorage.setItem(this.ids[num],JSON.stringify(theItem));
		this.totalPrice = 0;
		for(var i = 0;i < this.wishItems.length;i++){
			var x = this.wishItems[i].price.substring(1,this.wishItems[i].price.length);
			var itemPrice = parseFloat(x);
			this.totalPrice += itemPrice;
		}

	}

	removeItem(itemNum){
		var num = itemNum - 1;
		var imageStr = this.ids[num] + 'gurl';
		var titleStr = this.ids[num] + 'title';
		var priceStr = this.ids[num] + 'price';
		var shipStr = this.ids[num] + 'ship';
		var sellerStr = this.ids[num] + 'seller';
		this.notWish[itemNum - 1] = true;
		localStorage.removeItem(this.ids[num]);
		this.totalPrice = 0;
		for(var i = 0;i < this.wishItems.length;i++){
			var x = this.wishItems[i].price.substring(1,this.wishItems[i].price.length);
			var itemPrice = parseFloat(x);
			this.totalPrice += itemPrice;
		}
	}

	removeWishitem(itemNum){

		var num = itemNum - 1;
		var out = this.wishItems.splice(itemNum,1);

		var imageStr = out[0].id + 'gurl';
		var titleStr = out[0].id + 'title';
		var priceStr = out[0].id + 'price';
		var shipStr = out[0].id + 'ship';
		var sellerStr = out[0].id + 'seller';
		var setNum = this.ids.indexOf(out[0].id);
		
		/**console.log(setNum);*/
		this.notWish[setNum] = true;
		localStorage.removeItem(out[0].id);
		this.totalPrice = 0;
		for(var i = 0;i < this.wishItems.length;i++){
			var x = this.wishItems[i].price.substring(1,this.wishItems[i].price.length);
			var itemPrice = parseFloat(x);
			this.totalPrice += itemPrice;
		}
	}



	checkResult(){
		
		$('#result_bt').addClass('btn btn-dark').removeClass('btn-light');
		$('#wishlist_bt').addClass('btn btn-light').removeClass('btn-dark');
		$('#totalTable').show();
		$('#wishTable').hide();
	}

	checkWL(){
		
		$('#wishlist_bt').addClass('btn btn-dark').removeClass('btn-light');
		$('#result_bt').addClass('btn btn-light').removeClass('btn-dark');
		$('#totalTable').hide();
		$('#wishTable').show();
		this.totalPrice = 0;
		for(var i = 0;i < this.wishItems.length;i++){
			var x = this.wishItems[i].price.substring(1,this.wishItems[i].price.length);
			var itemPrice = parseFloat(x);
			this.totalPrice += itemPrice;
		}
	}
	useCurrZip(){
		this.model.zip = '';
		this.model.other = false;
		this.zipDisable = true;
		
	}

	useCustomZip(){
		this.model.currLoc = false;
		this.zipDisable = false;
	}

	autoComplete(){
		if(this.model.zip != undefined){
			var serverAuto = "/zipAuto?zipcode=" + this.model.zip;
		 	this.http.get(serverAuto).subscribe((response: any)=>{
				var zipJsonObj = response;
				for(var i = 0; i < 5;i++){
					if(zipJsonObj.postalCodes[i]!= undefined){
						this.options[i] = zipJsonObj.postalCodes[i].postalCode;
					}
				}

		 	});
		}
	}


  constructor(private http:HttpClient, public dialog: MatDialog) { }

  ngOnInit() {

  	var URL = "http://ip-api.com/json";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", URL, false);
	xmlhttp.send();
	var jsonObj = JSON.parse(xmlhttp.responseText);
	this.model.currLoc = true;
	this.theZip =  jsonObj.zip.toString();
	for(var i = 0;i < localStorage.length;i++){
		var jsonStr = localStorage.getItem(localStorage.key(i));
		this.wishItems.push(JSON.parse(jsonStr));
	}


  }

}
