var page_info_input=$("#page_info_input");var ranklist_toobar=$("#ranklist_toobar");var ranktable=$("#ranklist_table");var school_filter=$("#school_filter");var schoolDict=[];var schoolFilterCookieName="contest_school_filter_"+page_info_input.attr("cid");var school_filter_all=$("#school_filter_all"),school_filter_none=$("#school_filter_none");var autoRefreshInterval=20;var ac_color_to_chose=["#90ee90","#f9f3a1"];var ac_color=ac_color_to_chose[0];var table_div=$("#ranklist_table_div");var auto_refresh_time_span=$("#auto_refresh_time");var auto_refresh_time=autoRefreshInterval;var auto_refresh_time_timeout;function update_time(a){$("#start_time").text(a["start_time"]);$("#end_time").text(a["end_time"]);$("#contest_status").text(a["contest_status"])}function update_table_head(a,c){page_type=page_info_input.attr("page-type");columns=[];columns.push({field:"rank",align:"center",valign:"middle",sortable:"true",sorter:"rankSorter",width:"60",cellStyle:"rankCellStyle",title:"Rank"});if(page_type=="teamrank"){columns.push({field:"user_id",align:"left",valign:"middle",sortable:"true",width:"100",title:"ID"});columns.push({field:"nick",align:"left",valign:"middle",sortable:"true",width:"100",cellStyle:"nickCellStyle",title:"Team Name"})}else{columns.push({field:"school",align:"center",valign:"middle",sortable:"true",width:"180",cellStyle:"schoolCellStyle",title:"School"})}columns.push({field:"solved",align:"center",valign:"middle",sortable:"false",width:"60",title:"Solved"});columns.push({field:"penalty",align:"center",valign:"middle",sortable:"false",width:"80",title:"Penalty"});for(var b=0;b<a["problem_num"];b++){columns.push({field:String.fromCharCode(65+b),align:"center",valign:"middle",sortable:"false",width:"90",cellStyle:"acCellStyle",title:String.fromCharCode(65+b)})}if(page_type=="teamrank"){columns.push({field:"school",align:"left",valign:"middle",sortable:"false",width:"80",cellStyle:"schoolCellStyle",title:"School"});columns.push({field:"member",align:"left",valign:"middle",sortable:"false",width:"80",cellStyle:"memberCellStyle",title:"Member"})}else{columns.push({field:"topteam",align:"left",valign:"middle",sortable:"false",width:"80",cellStyle:"topteamCellStyle",title:"Top Team"})}c.bootstrapTable({toggle:"table",url:data_source,method:"GET",sidePagination:"client",striped:"true",showRefresh:"true",buttonsAlign:"left",toolbarAlign:"left",showExport:"true",toolbar:"#ranklist_toobar",exportTypes:"['excel', 'json', 'png']",exportOptions:"{'fileName':'teamrank'}",columns:columns})}$(document).ready(function(){$.ajax({url:"config.json",success:function(a){update_time(a);$("#contest_title").text(a["contest_title"]);update_table_head(a,ranktable)},type:"GET",dataType:"json",cache:false})});ranktable.on("load-success.bs.table",function(d,c){if(typeof(c)!="undefined"){schoolDict=[];for(var b=0;b<c.length;b++){if(typeof(c[b]["school"])!="undefined"){var a=$.trim(c[b]["school"]);if(a!=""){schoolDict[c[b]["school"]]=true}}}UpdateSchoollistFromCookie();UpdateSchoolFilter();UpdateFilterSchoolRank()}});function UpdateSchoollistFromCookie(){var d=$.cookie(schoolFilterCookieName);if(typeof(d)!="undefined"){try{var b=JSON.parse(d);for(var a in schoolDict){schoolDict[a]=b.indexOf(a)>-1}}catch(c){}}}function UpdateSchoollistCookie(){$.cookie(schoolFilterCookieName,JSON.stringify(school_filter.val()),{expires:1})}school_filter_all.on("click",function(){school_filter.selectpicker("selectAll")});school_filter_none.on("click",function(){school_filter.selectpicker("deselectAll")});school_filter.on("change",function(a){UpdateFilterSchoolRank();UpdateSchoollistCookie()});function UpdateSchoolFilter(){school_filter.empty();var a=[];var b=[];for(var c in schoolDict){if(schoolDict[c]==true){a.push(c)}b.push(c)}b.sort();for(var d=0;d<b.length;d++){school_filter.append("<option>"+b[d]+"</option>")}school_filter.selectpicker("val",a);school_filter.selectpicker("refresh")}function UpdateFilterSchoolRank(){var b=school_filter.val();for(var a in schoolDict){schoolDict[a]=b.indexOf(a)>-1}ranktable.bootstrapTable("filterBy",{"school":b})}ranktable.on("post-body.bs.table",function(){if(ranktable[0].scrollWidth>table_div.width()){table_div.width(ranktable[0].scrollWidth+20)}});$(window).keydown(function(a){if(a.keyCode==116&&!a.ctrlKey){if(window.event){try{a.keyCode=0}catch(a){}a.returnValue=false}a.preventDefault();ranktable.bootstrapTable("refresh")}});var color_blind_mode_box=$("#color_blind_mode_box");var auto_refresh_box=$("#auto_refresh_box");$(document).ready(function(){color_blind_mode_box.bootstrapSwitch();auto_refresh_box.bootstrapSwitch();auto_refresh_time_span.text(auto_refresh_time);if($.cookie("color_blind_mode")){var a=$.trim($.cookie("color_blind_mode"));if(a=="true"){color_blind_mode_box.bootstrapSwitch("state",true,true);ac_color=ac_color_to_chose[1]}else{color_blind_mode_box.bootstrapSwitch("state",false,false);ac_color=ac_color_to_chose[0]}}if($.cookie("auto_refresh_box")){var b=$.trim($.cookie("auto_refresh_box"));if(b=="true"){auto_refresh_box.bootstrapSwitch("state",true,true)
}else{auto_refresh_box.bootstrapSwitch("state",false,true)}}if(auto_refresh_box.bootstrapSwitch("state")){setTimeout(function(){RefreshTable()},autoRefreshInterval)}});auto_refresh_box.on("switchChange.bootstrapSwitch",function(a,b){if(b==true){RefreshTable();$.cookie("auto_refresh_box","true")}else{auto_refresh_time=autoRefreshInterval;auto_refresh_time_span.text(auto_refresh_time);clearTimeout(auto_refresh_time_timeout);$.cookie("auto_refresh_box","false")}});function RefreshTable(){auto_refresh_time--;if(auto_refresh_time<=0){ranktable.bootstrapTable("refresh");auto_refresh_time=autoRefreshInterval}auto_refresh_time_span.text(pad0left(auto_refresh_time,2,"0"));if(auto_refresh_box.bootstrapSwitch("state")){auto_refresh_time_timeout=setTimeout(function(){RefreshTable()},1000)}}color_blind_mode_box.on("switchChange.bootstrapSwitch",function(a,b){if(b==true){ac_color=ac_color_to_chose[1];$.cookie("color_blind_mode","true")}else{ac_color=ac_color_to_chose[0];$.cookie("color_blind_mode","false")}ranktable.bootstrapTable("load",ranktable.bootstrapTable("getOptions").data)});function rankSorter(f,d){var e=Number($(f).text());var c=Number($(d).text());if(e>c){return 1}if(e<c){return -1}return 0}var wa_color="#ee9090";var first_blood_color="#69b2f1";function acCellStyle(c,e,b){var d="",a=$(c);if(a.attr("pstatus")==1){d=wa_color}else{if(a.attr("pstatus")==2){d=ac_color}else{if(a.attr("pstatus")==3){d=first_blood_color}}}return{css:{"background-color":d,"min-width":"75px"}}}function rankSorter(f,d){var e=Number($(f).text());var c=Number($(d).text());if(e>c){return 1}if(e<c){return -1}return 0}function rankCellStyle(g,i,e){if($(g).attr("acforprize")=="0"){return{css:{"background-color":""}}}var f=$(g).text();var a="";var h=ranktable.bootstrapTable("getOptions").data.length;var c=Math.ceil(h*0.1-1e-7);var d=c+Math.ceil(h*0.15-1e-7);var b=d+Math.ceil(h*0.2-1e-7);if(f<=c){a="gold"}else{if(f<=d){a="slategray"}else{if(f<=b){a="darkcyan"}}}return{css:{"background-color":a}}}function nickCellStyle(b,c,a){return{css:{"min-width":"150px"}}}function schoolCellStyle(b,c,a){return{css:{"min-width":"180px"}}}function memberCellStyle(b,c,a){return{css:{"min-width":"300px"}}};