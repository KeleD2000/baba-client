import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FooldalService } from 'src/app/services/fooldal.service';
import { HtmlconvertService } from 'src/app/services/htmlconvert.service';

@Component({
  selector: 'app-kurzusoldal',
  templateUrl: './kurzusoldal.component.html',
  styleUrls: ['./kurzusoldal.component.css']
})
export class KurzusoldalComponent {
  urlParam: string = '';
  pageBody: any[] = [];

  constructor(private fooldalService: FooldalService, private router: ActivatedRoute, private htmlConvert: HtmlconvertService){}


  ngOnInit(){ 
    const currenUrl = this.router.snapshot.params['urlParam'];
    this.fooldalService.getPageAlias().subscribe(out => {
      for(const [key, value] of Object.entries(out)){
        if(key === 'data'){
          for(let i in value){
            if(currenUrl === value[i].attributes.alias.slice(1)){
              var drupal_id = value[i].attributes.path.split('/')[2];
              console.log(drupal_id);
              this.fooldalService.getPageFilter(drupal_id).subscribe(id => {
                for(const [key, value] of Object.entries(id)){
                  if(key === 'data'){
                    this.pageBody.push(this.htmlConvert.convertToHtml(value[0].body.value));
                    console.log(this.pageBody);
                  }
                  
                }
              });
            }
          }
        }
      }
    });
  }
  

}
