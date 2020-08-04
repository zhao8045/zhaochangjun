/**
* Layout
*/ 
<template>
  <el-container>
      <el-header>
  		<el-row class="nav">
  			<el-col :xs="5" :sm="4" :md="3" :lg="2" :xl="1">
  				<el-image class="logo" :src="logo" fit="fill"></el-image>
  			</el-col>
  			<el-col :xs="19" :sm="20" :md="21" :lg="22" :xl="23">
  				<el-menu :default-active="activeIndex" mode="horizontal">
  				  	<el-menu-item index="index"><a href="index.html">index</a></el-menu-item>
  				  	<el-menu-item index="home"><a href="home.html">home</a></el-menu-item>
  				  	<el-menu-item index="about"><a href="about.html">about</a></el-menu-item>
  				</el-menu>
  			</el-col>
  		</el-row>
      </el-header>
      
      <el-main>
  		<slot></slot> 
      </el-main>
  	
  	<el-footer>
  	  <p class="footer">Copyright &copy;<a href="https://www.xichain.com.cn/xichain/" target="_blank">重庆小犀智能科技有限公司</a> ——军长</p>
  	</el-footer>
  </el-container>
</template>

<script>
	import logo from 'common/img/role.png';// 引入图片资源
	export default {
		name: 'Layout',
		props: {
			activeIndex:{
				type: String,
				required: true
			}
		},
		data() {
			return {
			  logo:logo
			}
		},
		created(){
			
		}
	}
</script>

<style lang="scss">
	.el-container {
		height:100%;
		.el-header{
			height: auto !important;
			background: #fff;
			border-bottom:1px solid #e6e6e6;
			.nav{
				display: flex;
				flex-wrap: nowrap;
				justify-content: space-evenly;
				align-items: center;
				.logo{
					width: 50px;
					height: 50px;
					vertical-align: middle;
				}
				.el-menu{
					&.el-menu--horizontal{
						border:none;
					}
					.el-menu-item{
						padding: 0 10px;
						a{
							display: block;
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
		
		.el-main{
			height: calc(100% - 120px);
		}
		
		.el-footer{
			.footer{
				font-size: 12px;
				color: #999;
				line-height: 60px;
				text-align: center;
			}
		}
		
	}
</style>