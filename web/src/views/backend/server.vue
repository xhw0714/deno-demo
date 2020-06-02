<template>
  <div>
    <Button type="primary" @click="serverVisible = true" class="add-btn">新增服务器</Button>
    <div>
      <div v-for="server in serverData" :key="server.id" style="margin-bottom: 20px">
        <div class="server-title">
          <div style="font-size: 18px;font-weight: 600">{{server.title}}</div>
          <div>
            <Button style="margin-right:10px" type="primary" @click="addSite(server.id)">添加服务</Button>
            <Button style="margin-right:10px" @click="updateServer(server.id, server)">修改</Button>
            <Poptip
              confirm
              style="z-index:99999"
              title="确定要删除这个操作吗"
              @on-ok="handleDelServer(server.id)"
            >
              <Button>删除服务器</Button>
            </Poptip>
          </div>
        </div>
        <Divider size="small" />
        <Table :columns="siteColumns" :data="server.sites">
          <template slot-scope="{ row }" slot="options">
            <a v-for="option in row.options" :key="option.id" style="color:#333;margin:5px;display:inline-block">
              <span
                @click="addOption(server.id, row.id, option)"
                style="border: 1px solid #dedede;padding: 3px 5px;font-size:12px;"
              >{{option.title}}</span>
              <Poptip
                confirm
                style="z-index:99999"
                title="确定要删除这个操作吗"
                @on-ok="delOption(server.id, row.id, option.id)"
              >
                <span
                  style="border:1px solid #dedede;font-size: 12px; padding:3px 6px;border-left:none"
                >x</span>
              </Poptip>
            </a>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="addOption(server.id, row.id)"
            >添加操作</Button>
            <Button
              type="primary"
              size="small"
              style="margin-right: 5px"
              @click="updateSite(server.id, row)"
            >修改服务</Button>
            <Poptip
              confirm
              style="z-index:99999"
              title="确定要删除这个服务吗"
              @on-ok="handleDelSite(server.id, row.id)"
            >
              <Button size="small">删除服务</Button>
            </Poptip>
          </template>
        </Table>
      </div>
    </div>
    <!-- 服务器 -->
    <Drawer
      title="新增服务器"
      :closable="false"
      :mask-closable="false"
      v-model="serverVisible"
      width="420"
    >
      <Form ref="serverForm" :model="serverValue" :rules="ruleInline" :label-width="120">
        <FormItem label="服务器名称：" prop="title">
          <Input v-model="serverValue.title" placeholder="服务器名称"></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="close('serverVisible', 'serverForm')">取消</Button>
        <Button type="primary" @click="handleAddServer('serverForm')">提交</Button>
      </div>
    </Drawer>
    <!-- 服务 -->
    <Drawer title="新增服务" :closable="false" :mask-closable="false" v-model="siteVisible" width="420">
      <Form ref="siteForm" :model="siteValue" :rules="siteRule" :label-width="120">
        <FormItem label="服务名称" prop="title">
          <Input v-model="siteValue.title" placeholder="服务名称"></Input>
        </FormItem>
        <FormItem label="域名" prop="urlName">
          <Input v-model="siteValue.urlName" placeholder="域名"></Input>
        </FormItem>
        <FormItem label="接口" prop="url">
          <Input v-model="siteValue.url" placeholder="接口"></Input>
        </FormItem>
        <FormItem label="前端链接" prop="webUrl">
          <Input v-model="siteValue.webUrl" placeholder="接口"></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 10px" @click="close('siteVisible', 'siteForm')">取消</Button>
        <Button type="primary" @click="handleAddSite('siteForm')">提交</Button>
      </div>
    </Drawer>

    <!-- 操作 -->
    <Drawer title="添加" :closable="false" :mask-closable="false" v-model="optionVisible" width="420">
      <Form ref="optionForm" :model="optionValue" :rules="optionRule" :label-width="120">
        <FormItem label="操作类型：" prop="title">
          <Input v-model="optionValue.title"></Input>
        </FormItem>
        <FormItem label="操作链接：" prop="link">
          <Input v-model="optionValue.link"></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="close('optionVisible', 'optionForm')">取消</Button>
        <Button type="primary" @click="handleAddOption('optionForm')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  postServer,
  getServer,
  postSite,
  delServer,
  postOptions,
  updateOptions,
  delOption,
  updateServer,
  updateSite,
  delSite
} from "../../service/service.js";
export default {
  data() {
    return {
      siteColumns: [
        {
          title: "服务名称",
          key: "title"
        },
        {
          title: "域名",
          key: "urlName"
        },
        {
          title: "接口",
          key: "url"
        },
        {
          title: "前端链接",
          key: "webUrl"
        },
        {
          title: "操作",
          slot: "options"
        },
        {
          title: "Action",
          width: 300,
          slot: "action"
        }
      ],
      serverValue: {
        id: "",
        title: ""
      },
      optionValue: {
        serverId: "",
        siteId: "",
        optionId: "",
        title: "",
        link: ""
      },
      optionVisible: false,
      ruleInline: {
        name: [{ required: true, message: "请输入服务器名称", trigger: "blur" }]
      },

      siteRule: {
        title: [{ required: true, trigger: "blur" }],
        urlName: [{ required: true, trigger: "blur" }],
        url: [{ required: true, trigger: "blur" }],
        webUrl: [{ required: true, trigger: "blur" }]
      },
      optionRule: {
        title: [{ required: true, trigger: "blur" }],
        link: [{ required: true, trigger: "blur" }]
      },
      serverVisible: false,
      serverData: [],

      siteVisible: false,
      siteValue: {
        serverId: "",
        title: "",
        urlName: "",
        url: "",
        webUrl: ''
      }
    };
  },
  methods: {
    handleAddServer(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.serverValue.id === "" || !this.serverValue.id) {
            postServer({
              title: this.serverValue.title
            }).then(() => {
              this.$Message.success("添加成功");
              this.serverVisible = false;
              this.$refs[name].resetFields();
              this.getData();
            });
          } else {
            updateServer({
              ...this.serverValue
            }).then(() => {
              this.$Message.success("修改成功");
              this.serverVisible = false;
              this.serverValue.id = ''
              this.$refs[name].resetFields();
              this.getData();
            });
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleAddSite(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.siteValue.id === "" || !this.siteValue.id) {
            postSite({
              ...this.siteValue
            }).then(() => {
              this.$Message.success("添加成功");
              this.siteVisible = false;
              this.siteValue.serverId = "";
              this.$refs[name].resetFields();
              this.getData();
            });
          } else {
            updateSite({
              ...this.siteValue
            }).then(() => {
              this.$Message.success("修改成功");
              this.siteVisible = false;
              this.siteValue.id = ''
              this.$refs[name].resetFields();
              this.getData();
            });
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleDelServer(id) {
      delServer({
        data: {
          id
        }
      }).then(() => {
        this.$Message.success("删除成功");
        this.getData();
      });
    },
    handleDelSite(serverId, id) {
      delSite({
        data: {
          serverId,
          id
        }
      }).then(() => {
        this.$Message.success("删除成功");
        this.getData();
      });
    },
    handleAddOption(name) {
      this.$refs[name].validate(valid => {
        console.log(this.optionValue);
        if (valid) {
          if (this.optionValue.id === "" || !this.optionValue.id) {
            postOptions({
              ...this.optionValue
            }).then(() => {
              this.$Message.success("添加成功");
              this.optionVisible = false;
              this.optionValue.serverId = "";
              this.optionValue.siteId = "";
              this.optionValue.id = "";
              this.$refs[name].resetFields();
              this.getData();
            });
          } else {
            updateOptions({
              ...this.optionValue
            }).then(() => {
              this.$Message.success("修改");
              this.optionVisible = false;
              this.optionValue.serverId = "";
              this.optionValue.siteId = "";
              this.optionValue.id = "";
              this.$refs[name].resetFields();
              this.getData();
            });
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    addSite(id) {
      this.siteValue.serverId = id;
      this.siteVisible = true;
    },
    getData() {
      getServer().then(res => {
        console.log(res);
        this.serverData = res.data;
      });
    },
    addOption(serverId, siteId, row) {
      this.optionValue.serverId = serverId;
      this.optionValue.siteId = siteId;
      this.optionVisible = true;
      console.log(row);
      if (row) {
        this.optionValue = {
          ...this.optionValue,
          ...row
        };
      }
    },
    close(visible, name) {
      console.log(visible, name);
      this[visible] = false;
      this.$refs[name].resetFields();
    },
    updateServer(id, server) {
      console.log(server);
      this.serverVisible = true;
      this.serverValue = {
        id: server.id,
        title: server.title
      };
    },
    updateSite(serverId, row) {
      this.siteVisible = true;
      this.siteValue = {
        serverId,
        ...row
      };
    },
    delOption(serverId, siteId, optionId) {
      console.log(serverId, siteId, optionId);
      delOption({
        data: {
          serverId,
          siteId,
          id: optionId
        }
      }).then(() => {
        this.$Message.success("删除成功");
        this.getData();
      });
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.add-btn {
  margin-bottom: 30px;
}
.server-title {
  display: flex;
  padding: 0px 20px;
  align-items: center;
  justify-content: space-between;
}
.ivu-table-wrapper {
  overflow: initial !important;
}
</style>