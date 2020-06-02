<template>
  <div class="home">
    <h3>控制台</h3>
    <Divider />
    <Button type="primary" @click="getData()" style="margin-bottom:20px">刷新</Button>
    <Card
      :bordered="false"
      v-for="server in serverData"
      :key="server.id"
      style="margin-bottom: 20px"
    >
      <p slot="title">{{server.title}}</p>
      <div>
        <Table :columns="serverColumns" :data="server.sites">
          <template slot-scope="{ row }" slot="status">
            <Tag v-if="row.loading">加载中...</Tag>
            <Tag color="success" v-if="row.status && !row.loading">在线</Tag>
            <Tag color="error" v-if="!row.status && !row.loading">断开</Tag>
          </template>
          <template slot-scope="{ row }" slot="webStatus">
            <Tag v-if="row.webLoading">加载中...</Tag>
            <Tag color="success" v-if="row.webStatus && !row.webLoading">在线</Tag>
            <Tag color="error" v-if="!row.webStatus && !row.webLoading">断开</Tag>
          </template>
          <template slot-scope="{ row }" slot="webGit">
            <p>{{row.workWebGitInfo}}</p>
          </template>
          <template slot-scope="{ row }" slot="serverGit">
            <p>{{row.workServerGitInfo}}</p>
          </template>
          <template slot-scope="{ row }" slot="action">
            <span v-for="option in row.options" :key="option.id">
              <Button
                size="small"
                style="margin-right: 15px"
                @click="fetchUrl(option.link)"
              >{{option.title}}</Button>
            </span>
          </template>
        </Table>
      </div>
    </Card>
    <Divider />
    <h3>线程池</h3>
    <Divider />
    <Card :bordered="false" v-for="pool in poolData" :key="pool.id" style="margin-bottom: 20px">
      <p slot="title">{{pool.title}}</p>
      <p v-html="pool.detail"></p>
    </Card>
  </div>
</template>

<script>
import { getServer, getPool, fetchServer } from "../service/service";
// let timer = null
export default {
  data() {
    return {
      serverData: [],
      poolData: [],
      serverColumns: [
        {
          title: "服务名称",
          key: "title",
          width: 120
        },
        {
          title: "域名",
          key: "urlName",
          width: 120
        },
        {
          title: "服务器在线状态",
          slot: "status",
          width: 140
        },
        {
          title: "前端在线状态",
          slot: "webStatus",
          width: 140
        },
        {
          title: "web端git版本",
          slot: "webGit"
        },
        {
          title: "服务端git版本",
          slot: "serverGit"
        },
        {
          title: "操作",
          slot: "action",
          width: 400
        }
      ]
    };
  },
  methods: {
    fetchUrl(url) {
      fetchServer({
        url
      }).then(() => {
        this.$Message.success("操作成功");
      });
    },
    getData() {
      getServer().then(res => {
        this.serverData = res.data;
        this.serverData.forEach((e, i) => {
          e.sites &&
            e.sites.forEach((e1, index) => {
              this.$set(this.serverData[i].sites, index, {
                ...e1,
                loading: true,
                webLoading: true
              });
              fetchServer({
                url: e1.webUrl
              })
                .then(() => {
                  this.$set(this.serverData[i].sites, index, {
                    ...this.serverData[i].sites[index],
                    webStatus: true,
                    webLoading: false
                  });
                })
                .catch(() => {
                  console.log(111111)
                  this.$set(this.serverData[i].sites, index, {
                    ...this.serverData[i].sites[index],
                    webStatus: false,
                    webLoading: false
                  });
                });
              fetchServer({
                url: e1.url
              })
                .then(res => {
                  this.$set(this.serverData[i].sites, index, {
                    ...this.serverData[i].sites[index],
                    ...res.data,
                    status: true,
                    loading: false
                  });
                })
                .catch(() => {
                  console.log(1111)
                  this.$set(this.serverData[i].sites, index, {
                    ...this.serverData[i].sites[index],
                    status: false,
                    loading: false
                  });
                });
            });
        });
      });
      getPool().then(res => {
        this.poolData = []
        res.data.forEach(e => {
          fetchServer({
            url: e.api
          }).then(res => {
            this.poolData.push({
              ...e,
              detail: res.data[e.keyword]
            });
          });
        });
      });
    }
  },
  created() {
    this.getData();
    
    // timer = setInterval(() => {
    //   this.getData();
    // }, 10000);
  },
  // destroyed() {
  //   clearInterval(timer)
  // }
};
</script>

<style scope>
.home {
  height: 100%;
  background-color: #f7f7f7;
  padding: 20px;
}
</style>