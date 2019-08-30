#基础模块：日志系统，shell执行命令等
import os
import time
import urllib
import http.cookiejar
import json
import subprocess


class executeException(BaseException):
    def __repr__(self):
        print("shell command execute failed!")

def shell_execute(cmd):
    status,output = subprocess.getstatusoutput(cmd)
    if status != 0:
        raise executeException
    return output

#建立opener，请求数据
def get_opener():
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    return opener

def request_ajax(opener,url,body):
    postdata = json.dumps(body).encode('utf-8')
    header = {'Content-Type': 'application/json','X-Requested-With': 'XMLHttpRequest'}
    req = urllib.request.Request(url,postdata,header)
    response = opener.open(req)
    return response

def getSession(opener):
    session_url = init_url + "get_session_ajax"
    session_body = {"station_id": station_id, "token": token}
    ret=postcmd(opener, session_url, session_body)
    return ret

def postcmd(opener,url,body):
    response = request_ajax(opener, url, body)
    ret = json.loads(response.read().decode('utf-8'))
    return ret

def unix_timestamp(dt):
    "日期格式：2019-02-28 10:23:29 转换为时间戳"
    #转换成时间数组
    timeArray = time.strptime(dt, "%Y-%m-%d %H:%M:%S")
    # 转换成时间戳
    timestamp = int(time.mktime(timeArray))
    return timestamp
    
if __name__  == "__main__":

    paramddict = {}
    paramddict["contest_title"] = "2019年(第15届)'强智杯'湖南省大学生计算机程序设计竞赛"
    paramddict["problem_num"] =11
    paramddict["start_time"] = "2019-08-30 09:00:00"
    paramddict["end_time"] = "2019-08-30 14:00:00"
    paramddict["current_time"] = time.time()
    paramddict["contest_status"] = "Running"
    
    start_timestamp = unix_timestamp(paramddict["start_time"])
    end_timestamp = unix_timestamp(paramddict["end_time"])
    frozen_timestamp = start_timestamp + (end_timestamp - start_timestamp) * (4/5)
    print("start time:",start_timestamp,"end time:",end_timestamp,"frozen time:",frozen_timestamp)
       
    init_url = "http://172.27.48.15:22080/cpcsys/contest/"
    cid = "1"
    ajax_url = {"teamrank.json":"ranklist_ajax?cid="+cid, "schoolrank.json":"schoolrank_ajax?cid="+cid}
    opener=get_opener()
    body={}
    while True: 
    
        paramddict["current_time"] = time.time()
        #dt = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        if paramddict["current_time"] < start_timestamp:
            paramddict["contest_status"] = "Coming"
        elif paramddict["current_time"] < frozen_timestamp:
            paramddict["contest_status"] = "Running"
        elif frozen_timestamp < paramddict["current_time"] < end_timestamp:
            paramddict["contest_status"] = "Frozen"
        elif paramddict["current_time"] > end_timestamp:
            paramddict["contest_status"] = "Ended"
        with open("config.json","w",encoding='utf-8') as f:
            json.dump(paramddict,f)
            f.close
        
        for val in ajax_url.keys():
            url=init_url+ajax_url[val]
            ret = postcmd(opener,url,body)
            
            with open(val,"w",encoding="utf-8") as f:
                json.dump(ret,f,ensure_ascii=False)
                f.close()
            #rsync_cmd = ""
            #status = subprocess.getstatusoutput(rsync_cmd)[0]
            ### git related ###########################################
            subprocess.check_call(['git', 'add', '.'])
            subprocess.check_call(['git', 'commit', '-am', '\"update\"'])
            subprocess.check_call(['git', 'push'])

            ###########################################################
            print("%s get finished,check please!!!" % val)
        print("*"*30)
        time.sleep(30)
   