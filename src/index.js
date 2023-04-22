const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger')

module.exports = class HttpMockServer{
    constructor(opt = {}){
        this.opt = opt;
        this.app = new Koa();
        this.router = new Router({
            prefix: '/mock'
        });
    }
    run(){
        const port = this.opt?.port || 3333;
        this.app.use(logger());
        this.app.use(bodyParser());
        this.router.all('/:status/:cost?', async (ctx, next) => {
            // 请求耗时
            const cost = parseInt(ctx.params.cost || '0');
            // 请求状态码
            const status = parseInt(ctx.params.status || '200');
            ctx.status = status;
            console.log('query:', ctx.request.query, ctx.params);
            console.log('body:', ctx.request.body);

            const isCors = ctx.request.query?.cors || ctx.request.body?.cors || false;

            let headers = {};
            if(isCors){
                headers = {
                    ...headers,
                    'Access-Control-Allow-Origin': '*',
                }
            }
            try{
                const hq = ctx.request.query?.headers;
                if(hq){
                    const queryHeaders = JSON.parse(hq);
                    headers = {
                        ...headers,
                        ...queryHeaders,
                    }
                }
            }catch(err){
                // console.error(err);
                ctx.set('x-q-h-err', err.message)
            }
            try{
                const bodyHeaders = ctx.request.body?.headers;
                if(bodyHeaders){
                    headers = {
                        ...headers,
                        ...bodyHeaders,
                    }
                }
            }catch(err){
                ctx.set('x-b-h-err', err.message)
            }
            const qb = ctx.request.query?.body;
            if(qb){
                ctx.body = qb;
            }
            const bb = ctx.request.body?.body;
            if(bb){
                ctx.body = bb;
            }
            if(cost){
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve();
                    }, cost);
                });
            }
            Object.entries(headers).forEach(([key, val]) => {
                ctx.set(key, val);
            });
            await next();
        });
        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        // app.use(ctx => {
        //     ctx.body = 'Hello Koa';
        // });
        this.app.listen(port);
    }
}
