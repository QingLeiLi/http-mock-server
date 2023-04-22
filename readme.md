# Http mock

用来模拟Http的一些数据，例如：状态码、耗时、header、body等。
like：https://httpstat.us/

URL定义：
`/mock/:status/:cost`

status：请求返回的状态码  
cost：服务端阻塞的耗时，Http请求的时间肯定高于该时间  

参数（支持query和body）：  
headers：响应返回的header  
cors：是否指定跨域的 Access-Control-Allow-Origin 头  
body：请求返回的响应体  
