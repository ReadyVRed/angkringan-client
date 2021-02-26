import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { SupabaseService } from './supabase.service';
import * as xlsx from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class XlsxService {

  constructor(private supabase: SupabaseService,
    private appService: AppService) { }

  jsonToXlsx(data, filename) {
    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(data);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, filename);
    xlsx.writeFile(wb, filename + '.xlsx');
  }
}
