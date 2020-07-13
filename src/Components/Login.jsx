import React, { Component } from "react";
import { Form, Input, Button, Select } from "antd";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '@/Style/login.scss';

const { Option } = Select;
// const selectBefore = (
//   <Select defaultValue="+86" style={{ width: 90, height: 45 }}>
//     <Option value="+86">+86</Option>
//   </Select>
// );

class Login extends Component {
  onFinish = values => {
    console.log('Success:', values);
  };

  render() {
    return (
      <div className='loginBox'>
        <header className='loginHeader'>
          <img src='assets/logo-login.png' alt='demo' />
        </header>

        <div className='loginBody' style={{ backgroundImage: 'url(assets/login-bg.png)' }}>
          <div className='loginInput'>
            <p>GIC商户后台登录</p>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名!' }]}
              >
                <Input.Group compact>
                  <Select defaultValue="+86" style={{ width: 80, height: 45 }}>
                    <Option value="+86">+86</Option>
                  </Select>
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" style={{ height: 45, width: 244 }} />
                </Input.Group>
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码!' }]}
              >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} style={{ height: 45 }} placeholder="请输入密码" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ height: 45, width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <footer>Copyright 2019 Demogic.com All Rights Reserved 浙ICP备15033117号-1</footer>
      </div>
    )
  }
}

export default withRouter(Login)