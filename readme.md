# Hi, there 👋

`openai-proxy` 是为中国用户提供的一个方案，即解决 openai api 无法正常请求。

现在您只需要将 `https://api.openai.com/` 替换成 `https://openai.aihey.cc/` 即可食用。

```bash
# openai api
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# 替换后
curl https://openai.aihey.cc/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

---

## ✨ 新特征

### 支持查询费用消耗量

> 自从 2023 年 04 月份开始，`https://api.openai.com/dashboard/billing/credit_grants` 只能通过网页登录生成的 session id 来请求，而 key (`sk-*****`) 的方式将无效。**不过您可以通过下述两个方式来请求**。

#### 方式1：使用 `openai-proxy`

缺点：
- 可能和网页端显示的数据存在差异（这个不知道为啥，有了解的小伙伴欢迎在 ISSUES 指出）

```bash
# 指定统计开始日期和结束日期
curl https://openai.aihey.cc/billing/credit_grants?start_date=2022-05-10&end_date=2023-05-10 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-***********"

# 不指定参数，默认统计最近 90 天的数据
curl https://openai.aihey.cc/billing/credit_grants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-**********"
```

#### 方式2：使用网页端生成的 `sensitive_id` 

缺点：
- 首次需要去网页端获取（按 F12 后刷新网页） 
- 可能随时会失效（但目前来看只要网页端不退出登录，`sensitive_id` 时效都比较长）

![](assets/openai.png)

```bash
curl https://openai.aihey.cc/billing/credit_grants\
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sess-*****"
```

## 🎉 自行部署

#### step 1: 使用 vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=openai-proxy&repository-name=openai-proxy&repository-url=https://github.com/UNICKCHENG/openai-proxy&from=github)

#### step 4: 自定义域名

![](assets/vercel.png)

#### step 2: 去域名服务商添加 CNAME
```
cname-china.vercel-dns.com 
```


## 👉 声明

### openai api key 会不会被盗用（重点）

**不会，但也请不要放下警惕**。市面上已有很多同类**开源**的优秀产品，都不会恶意地盗用使用者的 key。但由于缺乏监控和不低的辨识成本，难免会出现这类情况。因此，在使用第三方平台的产品，**尽量使用一个定期更新的 key**。

### 为什么创建这个项目

因为想学[ Next.js](https://nextjs.org/docs)，所以有了这个项目。

另外，这里只是提供一个方案，对于 API 请求速度并没得到多少提升，自行部署还需要额外提供域名，似乎听着就嫌麻烦。

- 如果你是名爱折腾的开发者，或许也可以尝试 Nginx、Cloudflare 等方案
- 如果你希望有个直接拿来用的方案，那么请放心大胆地白嫖


## 💖 感谢

- <https://vercel.com/docs>
- <https://nextjs.org/docs>
- <https://platform.openai.com/docs/api-reference>