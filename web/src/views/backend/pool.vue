<template>
  <div>
    <Button
      type="primary"
      @click="poolVisible = true"
      class="add-btn"
      style="margin-bottom: 20px"
    >新增线程池</Button>
    <Table :columns="poolColumns" :data="poolData">
      <template slot-scope="{ row }" slot="action">
        <Button type="primary" size="small" style="margin-right: 5px" @click="updatePool(row)">修改线程池</Button>
        <Poptip confirm style="z-index:99999" title="确定要删除这个服务吗" @on-ok="handleDelPool(row.id)">
          <Button size="small">删除线程池</Button>
        </Poptip>
      </template>
    </Table>
    <!-- 线程池 -->
    <Drawer
      title="新增线程池"
      :closable="false"
      :mask-closable="false"
      v-model="poolVisible"
      width="420"
    >
      <Form ref="poolForm" :model="poolValue" :rules="poolRule" :label-width="120">
        <FormItem label="线程池名称：" prop="title">
          <Input v-model="poolValue.title" placeholder="线程池名称"></Input>
        </FormItem>
        <FormItem label="请求接口：" prop="api">
          <Input v-model="poolValue.api" placeholder="请求接口"></Input>
        </FormItem>
        <FormItem label="展示字段：" prop="keyword">
          <Input v-model="poolValue.keyword" placeholder="展示字段"></Input>
        </FormItem>
      </Form>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="close('poolVisible', 'poolForm')">取消</Button>
        <Button type="primary" @click="handleAddPool('poolForm')">提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  postPool,
  getPool,
  delPool,
  updatePool
} from "../../service/service.js";
export default {
  data() {
    return {
      poolColumns: [
        {
          title: "线程池",
          key: "title"
        },
        {
          title: "api",
          key: "api"
        },
        {
          title: "字段",
          key: "keyword"
        },
        {
          title: "Action",
          slot: "action"
        }
      ],
      poolVisible: false,
      poolValue: {
        title: "",
        api: "",
        keyword: ""
      },
      poolData: [],
      poolRule: {
        title: [{ required: true, trigger: "blur" }],
        api: [{ required: true, trigger: "blur" }],
        keyword: [{ required: true, trigger: "blur" }]
      }
    };
  },
  methods: {
    handleAddPool(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.poolValue.id === "" || !this.poolValue.id) {
            postPool({
              ...this.poolValue
            }).then(() => {
              this.$Message.success("添加成功");
              this.poolVisible = false;
              this.$refs[name].resetFields();
              this.getPool();
            });
          } else {
            updatePool({
              ...this.poolValue
            }).then(() => {
              this.$Message.success("修改成功");
              this.poolVisible = false;
              this.poolValue.id = ''
              this.$refs[name].resetFields();
              this.getPool();
            });
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleDelPool(id) {
      delPool({
        data: {
          id
        }
      }).then(() => {
        this.$Message.success("删除成功");
        this.getPool();
      });
    },
    getPool() {
      getPool().then(res => {
        console.log(res);
        this.poolData = res.data;
      });
    },
    updatePool(row) {
      console.log(row);
      this.poolVisible = true;
      this.poolValue = {
        ...row
      };
    },
    close(visible, name) {
      console.log(visible, name);
      this[visible] = false;
      this.$refs[name].resetFields();
    }
  },
  created() {
    this.getPool();
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