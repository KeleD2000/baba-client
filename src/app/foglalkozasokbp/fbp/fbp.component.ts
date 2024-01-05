import { DatePipe } from '@angular/common';
import { format, parseISO, isEqual, isBefore, isAfter } from 'date-fns';
import { ChangeDetectorRef, Component, ElementRef, Renderer2, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fbp',
  templateUrl: './fbp.component.html',
  styleUrls: ['./fbp.component.css']
})

export class FbpComponent {
  content: any[] = [];
  hallProducts: any[] = [];
  hallProductsMaps: any[] = [];
  baseUrl: string = "https://baba.datastep.solutions:8443";
  isTextCondensed: boolean = false;
  isTextBackgroundGreen: boolean = false;
  showModal1: boolean = false;
  showModal2: boolean = false;
  modalTitle1: string = '';
  modalTitle2: string = '';
  modalContent1: string = '';
  modalContent2: string = '';
  selectedProductId: string = '';
  todayDateVsHallDate: boolean = true;
  convertedDate!: Date;
  loggedInSelectedProductId: string = '';
  loggedInConvertedDate!: Date;
  isLoggedIn: boolean = false;
  userUuid: string = '';
  productDatas: any = {};
  bookData: any = {};
  postDataProducts: any = {};
  bookForm!: FormGroup
  private hallSubscription: Subscription | undefined;

  constructor(private fooldalService: FooldalService, private datePipe: DatePipe,
    private htmlconvertService: HtmlconvertService, private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef, private renderer: Renderer2, private router: Router) {
    this.bookForm = new FormGroup({
      email: new FormControl('')
    });
  }

  sendBookForm() {
    if (this.bookForm.valid) {
      var email = this.bookForm.get('email')?.value
    }
    const bookData = {
      "data": {
        "type": "hallsession_appointment--default",
        "attributes": {
          "status": true,
          "field_email": email,
          "field_email_at": this.convertedDate
        },
        "relationships": {
          "field_product": {
            "data": {
              "type": "product--hallsession",
              "id": this.selectedProductId
            }
          }
        }
      }
    }
    this.fooldalService.postHallBook(bookData).subscribe(book => {
      console.log(book);
      window.location.reload();
    })
  }

  extractVideoIdAndTime(url: string): { videoId: string | null, time: string | null } {
    const videoIdRegex = /[?&]v=([^&#]*)/i;
    const timeRegex = /[?&]t=([^&#]*)/i;

    const videoIdMatch = videoIdRegex.exec(url);
    const timeMatch = timeRegex.exec(url);

    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    const time = timeMatch ? timeMatch[1] : null;

    return { videoId, time };
  }

  isLastItem(index: number): boolean {
    return index === this.hallProducts.length - 1;
  }

  openBookModalInLogged(productId: string, date: Date) {
    this.loggedInSelectedProductId = productId;
    this.loggedInConvertedDate = date;


    const storedDataString = localStorage.getItem('login');

    if (storedDataString) {

      const storedDataObject = JSON.parse(storedDataString);
      var loggedUserName = storedDataObject.current_user.name
    }

    this.fooldalService.getAllUsers().subscribe(user => {
      for (const [key, value] of Object.entries(user)) {
        if (key === 'data') {
          for (let i in value) {
            if (value[i].attributes.name === loggedUserName) {
              var loggedEmail = value[i].attributes.mail;
              this.userUuid = value[i].id;
              console.log(this.userUuid);
              this.bookData = {
                "data": {
                  "type": "hallsession_appointment--default",
                  "attributes": {
                    "status": true,
                    "field_email": loggedEmail,
                    "field_email_at": this.loggedInConvertedDate
                  },
                  "relationships": {
                    "field_product": {
                      "data": {
                        "type": "product--hallsession",
                        "id": this.loggedInSelectedProductId
                      }
                    },
                    "uid": {
                      "data": {
                        "type": "user--user",
                        "id": this.userUuid
                      }
                    }
                  }
                }

              }
              this.fooldalService.postHallBook(this.bookData).subscribe(user => {
                console.log(user);
              });
            }
          }
        }
      }
    });

    const modal1 = document.getElementById('exampleModal1');
    if (modal1) {
      modal1.style.display = 'block';
      modal1.classList.add('show');
    }

    this.showModal1 = true;
    this.renderer.addClass(document.body, 'no-scroll');

    this.modalTitle1 = 'Előjegyzés';

  }

  openBookModal(productId: string, date: Date) {
    this.selectedProductId = productId;
    this.convertedDate = date;


    const modal2 = document.getElementById('exampleModal2');

    if (modal2) {
      modal2.style.display = 'block';
      modal2.classList.add('show');
    }

    this.showModal2 = true; // Módosítás itt

    this.renderer.addClass(document.body, 'no-scroll');

    this.modalTitle1 = 'Facebook';
  }


  closeModal(modalNumber: number) {
    const modal1 = document.getElementById('exampleModal1');
    const modal2 = document.getElementById('exampleModal2');

    if (modal1 && modal2) {
      modal1.style.display = 'none';
      modal1.classList.remove('show');
      modal2.style.display = 'none';
      modal2.classList.remove('show');
    }

    this.showModal1 = false;
    this.showModal2 = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  ngOnInit() {
    const isUserLoggedIn = localStorage.getItem('login');
    if (isUserLoggedIn) {
      this.isLoggedIn = true;
      console.log(this.isLoggedIn);
    } else {
      this.isLoggedIn = false;
      console.log(this.isLoggedIn);
    }

    this.fooldalService.getId().subscribe((i) => {
      for (const [key, value] of Object.entries(i)) {
        if (Array.isArray(value)) {
          for (const [k, v] of Object.entries(value)) {
            if (v.title === 'Foglalkozások teremben') {
              this.fooldalService.getFooldal(v.id).subscribe((page) => {
                for (const [key, value] of Object.entries(page)) {
                  for (var k in value.field_paragraphs) {
                    console.log(value.field_paragraphs[k]);
                    const obj = {
                      content: '' as SafeHtml, youtube_video: "", img_url: "", img_layout: "",
                      video_url: "", text_condensed: "" as SafeHtml, button_content: "" as SafeHtml,
                      text_highlighted_content: "" as SafeHtml, video: "", video_thumbnail: "",
                      img_alt:"", img_blue_alt: "",
                      alignmentSettings: {
                        isCenterText: false,
                        isJustifiedText: false,
                        isRightText: false,
                        isLeftText: false
                      },
                      textColorSettings: {
                        isPink: false,
                        isBlue: false,
                        isItalic: false
                      }
                    }
                    if (value.field_paragraphs[k].type === 'paragraph--image_full') {
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_full.field_media_image.uri.url;
                      obj.img_alt = value.field_paragraphs[k].field_image_full.field_media_image.meta.alt
                    } else if (value.field_paragraphs[k].type === 'paragraph--image_text_blue') {
                      obj.content = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.img_url = this.baseUrl + value.field_paragraphs[k].field_image_inline.field_media_image.uri.url;
                      obj.img_blue_alt =  value.field_paragraphs[k].field_image_inline.field_media_image.meta.alt;
                      obj.img_layout = value.field_paragraphs[k].field_layout;
                    } else if (value.field_paragraphs[k].type === 'paragraph--text') {
                      console.log(value.field_paragraphs[k].field_alignment);
                      const alignment = value.field_paragraphs[k].field_alignment;

                      obj.alignmentSettings = {
                        isCenterText: alignment === 'align-center',
                        isJustifiedText: alignment === 'align-justified',
                        isRightText: alignment === 'align-right',
                        isLeftText: alignment === 'align-left'
                      };

                      const textColor = value.field_paragraphs[k].field_format;
                      obj.textColorSettings = {
                        isPink: textColor === 'color-pink',
                        isBlue: textColor === 'color-blue',
                        isItalic: textColor === 'style-italic'

                      };
                      if (value.field_paragraphs[k].field_content !== undefined) {
                        const paragraph_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                        obj.content = paragraph_value;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--video') {
                      //obj.video_url = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url;
                    } else if (value.field_paragraphs[k].type === 'paragraph--text_condensed') {
                      const paragraph_condensed = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_condensed = paragraph_condensed;
                      if (obj.text_condensed) {
                        this.isTextCondensed = true;
                      } else {
                        this.isTextCondensed = false;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--button') {
                      const button_value = value.field_paragraphs[k].field_content.value;
                      const buttonValueAsText: string = this.sanitizer.sanitize(SecurityContext.HTML, button_value) || '';
                      const buttonContentWithoutPTags = buttonValueAsText.replace(/<\/?p[^>]*>/g, '');
                      const buttonContentTrimmed = buttonContentWithoutPTags.trim();
                      obj.button_content = this.sanitizer.bypassSecurityTrustHtml(buttonContentTrimmed);
                    } else if (value.field_paragraphs[k].type === 'paragraph--text_highlighted') {
                      const highlighted_value = this.htmlconvertService.convertToHtml(value.field_paragraphs[k].field_content.value);
                      obj.text_highlighted_content = highlighted_value;
                      if (obj.text_highlighted_content) {
                        this.isTextBackgroundGreen = true;
                      } else {
                        this.isTextBackgroundGreen = false;
                      }
                    } else if (value.field_paragraphs[k].type === 'paragraph--video') {
                      obj.video = this.baseUrl + value.field_paragraphs[k].field_video.field_media_video_file.uri.url
                      obj.video_thumbnail = this.baseUrl + value.field_paragraphs[k].field_video.field_thumbnail.field_media_image.uri.url;
                    } else if (value.field_paragraphs[k].type === 'paragraph--youtube_video') {
                      const videoId = this.extractVideoIdAndTime(value.field_paragraphs[k].field_youtube_video.field_media_oembed_video).videoId;
                      obj.youtube_video = "https://www.youtube.com/embed/" + videoId
                    }
                    this.content.push(obj);

                  }
                }
              });
            }
          }
        }
      }
    });

    this.fooldalService.getHallSessionProduct().subscribe(hall => {
      for (const [key, value] of Object.entries(hall)) {
        if (key === 'data') {
          for (let i in value) {
            console.log(value[i]);
            const hallObj = {
              title: '',
              place: '',
              lat: 0,
              long: 0,
              date: '',
              desc: '' as SafeHtml,
              max_member: '',
              price: '',
              product_id: '',
              var_id: '',
              var_type: '',
              convertedDate: '',
              is_booked: false,
              is_can_pay: false,
              todayDateVsHallDate: true
            }
            hallObj.title = value[i].title;
            hallObj.place = value[i].field_location.field_label;
            let rawDate = value[i].field_date;
            let formattedDate = rawDate ? this.datePipe.transform(rawDate, 'yyyy.MM.dd. – HH:mm') : '';
            hallObj.date = formattedDate || ''
            let converted = this.htmlconvertService.convertToHtml(value[i].body.value);
            hallObj.desc = converted;
            hallObj.max_member = value[i].variations[0].field_headcount.available_stock;
            hallObj.price = value[i].variations[0].price.formatted;
            hallObj.product_id = value[i].id;
            hallObj.var_type = value[i].variations[0].type;
            hallObj.var_id = value[i].variations[0].id;
            let coord = value[i].field_location.field_address;
            const coordSplit = coord.split(',');
            const NumberLat = Number(coordSplit[0]);
            const NumberLong = Number(coordSplit[1]);
            const todayDate: string = format(new Date(), 'yyyy.MM.dd');
            const onlyDate: string = formattedDate ? formattedDate.split(' – ')[0] : '';
            const convertedTodayDate = format(new Date(todayDate), 'yyyy-MM-dd');
            const convertedOnlyDate = format(new Date(onlyDate), 'yyyy-MM-dd');
            hallObj.convertedDate = convertedOnlyDate;
            const convertTodayDate = parseISO(convertedTodayDate);
            const convertOnlyDate = parseISO(convertedOnlyDate);
            console.log(convertTodayDate);
            console.log(convertOnlyDate);
            if (isBefore(convertOnlyDate, convertTodayDate)) {
              hallObj.todayDateVsHallDate = false;

            }
            if (isEqual(convertOnlyDate, convertTodayDate) || isBefore(convertOnlyDate, convertTodayDate)) {
              hallObj.is_can_pay = true
            } else if (isAfter(convertOnlyDate, convertTodayDate)) {
              hallObj.is_booked = true;
            }
            hallObj.lat = NumberLat;
            hallObj.long = NumberLong;
            this.hallProducts.push(hallObj);
            localStorage.setItem('hall', JSON.stringify(this.hallProducts));
            this.cdr.detectChanges();
          }
        }
      }
    });
    console.log(this.hallProducts)

  }

  addCart(type: any, id: any) {
    this.postDataProducts = {
      data: [
        {
          type: type,
          id: id,
          meta: {
            quantity: 1,
            combine: true,
          },
        },
      ],
    };
    const objProf = {
      name: '',
    };
    const objBilling = {
      country_code: '',
      locality: '',
      postal_code: '',
      address_line1: '',
      address_line2: '',
      given_name: '',
      family_name: '',
    };
    this.fooldalService.addItemToCart(this.postDataProducts).subscribe((p) => {
      for (const [key, value] of Object.entries(p)) {
        if (key === 'data') {
          for (let i in value) {
            const obj = {
              title: '',
              price: '',
            };
            console.log(value[i].attributes);
            obj.title = value[i].attributes.title;
            obj.price = value[i].attributes.total_price.formatted;
            localStorage.setItem('product', JSON.stringify(obj));
            console.log(localStorage.getItem('product'));

            this.fooldalService.getAllUsers().subscribe((user) => {
              for (const [kk, vv] of Object.entries(user)) {
                if (kk === 'data') {
                  for (let j in vv) {
                    objProf.name = vv[j].attributes.name;

                    if (localStorage.getItem('login')) {
                      var loginData = JSON.parse(localStorage.getItem('login') || '');

                      if (loginData && loginData.current_user && loginData.current_user.name) {
                        var name = loginData.current_user.name;
                      }
                    }

                    if (name === objProf.name) {
                      var userId = vv[j].id;
                      console.log(userId);
                      this.fooldalService.getProfileCustomer().subscribe((profile) => {
                        for (const [k, v] of Object.entries(profile)) {
                          if (k === 'data') {
                            for (let j in v) {
                              if (userId === v[j].relationships.uid.data.id) {
                                objBilling.country_code = v[j].attributes.address.country_code;
                                objBilling.locality = v[j].attributes.address.locality;
                                objBilling.postal_code = v[j].attributes.address.postal_code;
                                objBilling.address_line1 = v[j].attributes.address.address_line1;
                                objBilling.address_line2 = v[j].attributes.address.address_line2;
                                objBilling.given_name = v[j].attributes.address.given_name;
                                objBilling.family_name = v[j].attributes.address.family_name;
                              }
                            }
                          }
                        }
                        this.productDatas = {
                          "data": {
                            "type": value[i].relationships.order_id.data.type,
                            "id": value[i].relationships.order_id.data.id,
                            "attributes": {
                              "billing_information": {
                                "address": {
                                  "country_code": objBilling.country_code,
                                  "locality": objBilling.locality,
                                  "postal_code": objBilling.postal_code,
                                  "address_line1": objBilling.address_line1,
                                  "address_line2": objBilling.address_line2,
                                  "given_name": objBilling.given_name,
                                  "family_name": objBilling.family_name,
                                },
                                "tax_number": {
                                  "type": null,
                                  "value": null
                                }
                              }
                            },
                            "relationships": {
                              "uid": {
                                "data": {
                                  "type": "user--user",
                                  "id": userId
                                }
                              }
                            }
                          }
                        };
                        var orderId = value[i].relationships.order_id.data.id;
                        this.fooldalService.addProductWithCart(this.productDatas, orderId).subscribe((p) => {
                          for (const [keyP, valueP] of Object.entries(p)) {
                            if (keyP === 'data') {
                              for (let k in valueP) {
                                console.log(valueP.id);
                                localStorage.setItem('productId', valueP.id.toString());
                              }
                            }
                          }
                        });
                      });
                    } else {
                      var userId2 = localStorage.getItem('user_id');
                      if (userId2 !== null) {
                        var userIdIfNotLog = userId2.replace(/"/g, '');
                        console.log(userId);
                      } else {
                        console.log('A "user_id" kulcs nem található a localStorage-ban.');
                      }
                      this.fooldalService.getProfileCustomer().subscribe((profile) => {
                        for (const [k, v] of Object.entries(profile)) {
                          if (k === 'data') {
                            for (let j in v) {
                              if (userIdIfNotLog === v[j].relationships.uid.data.id) {
                                objBilling.country_code = v[j].attributes.address.country_code;
                                objBilling.locality = v[j].attributes.address.locality;
                                objBilling.postal_code = v[j].attributes.address.postal_code;
                                objBilling.address_line1 = v[j].attributes.address.address_line1;
                                objBilling.address_line2 = v[j].attributes.address.address_line2;
                                objBilling.given_name = v[j].attributes.address.given_name;
                                objBilling.family_name = v[j].attributes.address.family_name;
                              }
                            }
                          }
                        }
                        this.productDatas = {
                          "data": {
                            "type": value[i].relationships.order_id.data.type,
                            "id": value[i].relationships.order_id.data.id,
                            "attributes": {
                              "billing_information": {
                                "address": {
                                  "country_code": objBilling.country_code,
                                  "locality": objBilling.locality,
                                  "postal_code": objBilling.postal_code,
                                  "address_line1": objBilling.address_line1,
                                  "address_line2": objBilling.address_line2,
                                  "given_name": objBilling.given_name,
                                  "family_name": objBilling.family_name,
                                },
                                "tax_number": {
                                  "type": null,
                                  "value": null
                                }
                              }
                            },
                            "relationships": {
                              "uid": {
                                "data": {
                                  "type": "user--user",
                                  "id": userIdIfNotLog
                                }
                              }
                            }
                          }
                        };
                        var orderId = value[i].relationships.order_id.data.id;
                        this.fooldalService.addProductWithCart(this.productDatas, orderId).subscribe((p) => {
                          for (const [keyP, valueP] of Object.entries(p)) {
                            if (keyP === 'data') {
                              for (let k in valueP) {
                                console.log(valueP.id);
                                localStorage.setItem('productId', valueP.id.toString());
                              }
                            }
                          }
                        });
                      });
                    }
                  }
                }
              }
            });
          }
        }
      }
      if (localStorage.getItem('login')) {
        this.router.navigate(['/fizetes']);
      } else {
        this.router.navigate(['/signin'], { queryParams: { from: 'foglalkozasok-teremben' } });
      }
    });
  }

  ngOnDestroy() {
    // Leiratkozás a hallSubscription-ról, hogy elkerüljük a memórialeakokat
    if (this.hallSubscription) {
      this.hallSubscription.unsubscribe();
    }
  }
}
