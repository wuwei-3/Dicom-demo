<!--
 * @Description: 首页搭建
 * @Version: 2.0
 * @Autor: wuwei3
 * @Date: 2020-08-12 14:29:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-19 10:19:46
-->
<template>
  <div class="dicom-main">
    <div class="l-bottom">
      <div class="m-left">
        <div
          class="t-tools-dis"
          v-show="percentage < 100 && percentage != 0"
        ></div>
        <!-- 工具集 -->
        <div :class="['t-tools']">
          <div class="s-title">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handlePreview"
              :file-list="fileList"
              :auto-upload="false"
              :show-file-list="false"
            >
              <div slot="trigger" class="e-upload">
                <i class="iconfont iconMRIjiancha"></i>
                <span>3D影像在线查看</span>
              </div>
            </el-upload>
          </div>
          <div class="s-box">
            <i class="iconfont iconmenu-list" @click="recordTab"></i>
          </div>
          <div class="s-percent" v-show="percentage < 100 && percentage != 0">
            <span>正在加载：{{ percentage + '%' }}</span>
          </div>
          <!-- volume -->
          <div class="s-volume">
            <span class="e-span">volume：</span>
            <el-input-number
              v-model="num"
              controls-position="right"
              @change="changeVolume"
              :min="1"
              :max="timeSlices"
              size="small"
              :disabled="timeSlices == 1"
            ></el-input-number>
          </div>
          <!-- 其他工具 -->
          <div
            v-for="(item, index) in toolList"
            :key="item.iconfont"
            :class="['s-other', item.status ? 's-select' : '']"
            :title="item.title"
            @click="clickTools(item, index)"
          >
            <i :class="'t-active iconfont ' + item.iconfont"></i>
          </div>
          <!-- 度量 -->
          <div
            :class="['s-other t-dialog1', measureStatus ? 's-select' : '']"
            title="工具"
          >
            <i class="t-active iconfont iconremark-measure"></i>
            <div class="r-tools">
              <div
                v-for="(meas, index) in measureList"
                :key="meas.iconfont"
                @click="clickInstros(meas, index)"
                :class="[meas.status ? 's-select' : '']"
              >
                <i :class="'iconfont ' + meas.iconfont"></i
                ><span>{{ meas.title }}</span>
              </div>
            </div>
          </div>
          <!-- 颜色 -->
          <div
            :class="['s-other t-dialog2', colorStatus ? 's-select' : '']"
            :title="'colorMap'"
          >
            <i class="t-active iconfont iconiamge-colormap"></i>
            <div class="r-tools">
              <div
                v-for="(color, index) in colorlist"
                :key="color.id"
                :class="['s-color', color.status ? 's-select' : '']"
                @click="colorMap(color.id, index)"
                :title="color.id"
              >
                <i :class="['color-bar' + color.id]"></i
                ><span> {{ color.name }}</span>
              </div>
            </div>
          </div>
          <!-- 视图 -->
          <div
            :class="['s-other t-dialog3', viewStatus ? 's-select' : '']"
            title="视图"
          >
            <i class="t-active iconfont iconimage-view"></i>
            <div class="r-tools">
              <div
                v-for="(meas, index) in viewList"
                :key="meas.iconfont"
                :class="['s-color', meas.status ? 's-select' : '']"
                @click="changeView(meas, index)"
                :title="meas.title"
              >
                <span>{{ meas.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- dicom 图 -->
        <div class="t-main">
          <div class="n-list" v-show="tabStatus">
            <!-- 图像评估 -->
            <div class="t-image">
              <div
                class="e-card"
                v-for="(item, index) in imageMark"
                :key="item.id"
                @mouseenter="enterOrLeaveTool(item, true)"
                @mouseleave="enterOrLeaveTool(item, false)"
                v-show="imageMark.length != 0"
              >
                <div class="e-title">
                  <span class="e-e">
                    <el-input
                      size="mini"
                      v-model="item.title"
                      maxlength="20"
                      :placeholder="'#-' + index"
                      @blur="blurTitle(item, index)"
                    >
                    </el-input>
                  </span>
                  <span class="e-icon">
                    <i
                      class="el-icon-close"
                      @click.stop="deleteTool(item, index)"
                      title="删除图像评估"
                    ></i>
                  </span>
                </div>
                <div class="e-result">
                  {{ item.value }}
                </div>
              </div>
              <div v-show="imageMark.length == 0" class="e-none">
                暂无数据
              </div>
            </div>
          </div>
          <!-- 图像 -->
          <div
            class="n-image"
            :style="{
              height: echartStatus ? 'calc(100% - 199px)' : 'calc(100% - 42px)',
            }"
            v-if="niftiStatus"
          >
            <div
              id="nifti-imagex"
              v-show="niftiNum == 1 || niftiNum == 4"
              :class="['e-x', selectView == 'nifti-imagex' ? 'n-active' : '']"
              @click="clickView('nifti-imagex')"
            ></div>
            <div
              id="nifti-imagey"
              v-show="niftiNum == 2 || niftiNum == 4"
              :class="['e-y', selectView == 'nifti-imagey' ? 'n-active' : '']"
              @click="clickView('nifti-imagey')"
            ></div>
            <div
              id="nifti-imagez"
              v-show="niftiNum == 3 || niftiNum == 4"
              :class="['e-z', selectView == 'nifti-imagez' ? 'n-active' : '']"
              @click="clickView('nifti-imagez')"
            ></div>
          </div>
          <div class="n-echarts" v-if="echartStatus">
            <div id="echarts"></div>
          </div>
          <!-- 底部坐标 -->
          <div class="n-xyz">
            <span>X：{{ imagX }}</span>
            <span>Y：{{ imagY }}</span>
            <span>Z：{{ imagZ }}</span>
            <span class="w90">Val：{{ imgVal }}</span>
            <span>Img：{{ currentThanLayers }}</span>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <el-dialog
      :title="'Slices，共' + spliceList.length + '个（' + splicePrecent + '%）'"
      :visible="visable"
      width="1060px"
      :before-close="handleClose"
      class="dialog"
      top="7vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      v-dialogDrag
    >
      <div
        :style="{ height: Math.round(spliceList.length / 7) * 150 + 'px' }"
        class="g-dis s-scrollbar"
      ></div>
      <div class="g-main">
        <div class="d-dicom" v-for="(item, i) in spliceList" :key="i">
          <div :id="'d-dicom' + i" class="m-image"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* 使用依赖 */
import cornerstoneMain from 'cornerstone-core';
import cornerstoneMath from 'cornerstone-math';
import * as cornerstoneToolMain from 'cornerstone-tools';
import * as cornerstoneTools from '@/utils/cornerstoneTools';
import * as cornerstoneNIFTIImageLoader from 'cornerstone-nifti-image-loader';
import Hammer from 'hammerjs';
let cornerstoneToolsMain = cornerstoneTools;

/* Old 工具 */
let cornerstone = cornerstoneMain;

cornerstoneToolsMain.external.cornerstone = cornerstone;
cornerstoneToolsMain.external.cornerstoneMath = cornerstoneMath;
cornerstoneNIFTIImageLoader.external.cornerstone = cornerstone;
cornerstoneNIFTIImageLoader.nifti.streamingMode = true;

/* 新工具 */
let cornerstoneToolsCore = cornerstoneToolMain;

cornerstoneToolsCore.external.cornerstone = cornerstone;
cornerstoneToolsCore.external.cornerstoneMath = cornerstoneMath;
cornerstoneToolsCore.external.Hammer = Hammer;

const ImageId = cornerstoneNIFTIImageLoader.nifti.ImageId;

/* 文件需要验证，从这里配置 */
// cornerstoneNIFTIImageLoader.nifti.configure({
//   headers: {
//     Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
//   },
// });
cornerstoneToolsCore.init();

/* 工具样式 */
const fontFamily =
  'Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';

cornerstoneToolsCore.textStyle.setFont(`16px ${fontFamily}`);
cornerstoneToolsCore.toolStyle.setToolWidth(2);
cornerstoneToolsCore.toolColors.setToolColor('rgb(255, 255, 0)');
cornerstoneToolsCore.toolColors.setActiveColor('rgb(0, 255, 0)');

cornerstoneToolsCore.store.state.touchProximity = 40;

/* 辅助线 */
let synchronizer = new cornerstoneToolsMain.Synchronizer(
  'cornerstonenewimage',
  cornerstoneToolsMain.updateImageSynchronizer
);

export default {
  components: {},
  data() {
    return {
      md5Par: null,
      checked: false,
      visable: false,
      issonStatus: false,
      tabStatus: false,
      num: '',
      rowResultStatus: true,
      /* 颜色值 */
      colorlist: [],
      /* 视图 */
      viewList: [
        { title: '矢状图', status: '', value: 'nifti-imagex', num: 1 },
        { title: '冠状图', status: '', value: 'nifti-imagey', num: 2 },
        { title: '横断图', status: '', value: 'nifti-imagez', num: 3 },
        {
          title: '三维图',
          status: true,
          value: 'nifti-imagex,nifti-imagey,nifti-imagez',
          num: 4,
        },
      ],
      /* 度量 */
      measureList: [
        {
          title: '长度',
          iconfont: 'iconrule-line',
          status: '',
          value: 'Length',
        },
        {
          title: '角度',
          iconfont: 'iconrule-angle',
          status: '',
          value: 'Angle',
        },
        {
          title: '椭圆',
          iconfont: 'iconrule-circle',
          status: '',
          value: 'EllipticalRoi',
        },
        {
          title: '矩形',
          iconfont: 'iconrule-rect',
          status: '',
          value: 'RectangleRoi',
        },
      ],
      /* 工具类 */
      toolList: [
        {
          title: '播放图层',
          iconfont: 'iconvolume-play',
          status: '',
          value: 'play',
        },
        {
          title: '缩放',
          iconfont: 'iconimage-zoom',
          status: '',
          value: 'Zoom',
        },
        { title: '移动', iconfont: 'iconimage-move', status: '', value: 'Pan' },
        {
          title: '左右翻转',
          iconfont: 'iconflip-leftright',
          status: '',
          value: 'hflip',
        },
        {
          title: '上下翻转',
          iconfont: 'iconflip-updown',
          status: '',
          value: 'vflip',
        },
        {
          title: '复原',
          iconfont: 'iconimage-recover',
          status: '',
          value: 'reset',
        },
        {
          title: '标注',
          iconfont: 'iconimage-remark',
          status: '',
          value: 'ArrowAnnotate',
        },
        {
          title: '层级',
          iconfont: 'iconimage-level',
          status: '',
          value: 'Wwwc',
        },
        {
          title: '十字线',
          iconfont: 'iconremark-crossline',
          status: '',
          value: 'cross',
        },
        {
          title: '橡皮擦',
          iconfont: 'iconremark-erase',
          status: '',
          value: 'Eraser',
        },
        {
          title: '切片',
          iconfont: 'iconremark-section',
          status: '',
          value: 'slice',
        },
        {
          title: 'TimeSeries',
          iconfont: 'iconimage-curve',
          status: false,
          value: 'echarts',
        },
      ],
      /* 在线影像数据地址：解决本地文件跨域 */
      url: '/service/dcm/bold_2x2x2_s4_tr1500_P2A_195_08.nii.gz',
      // url: '/service/dcm/t1_mprage_sag_0.8iso_p2_64ch_02.nii.gz',
      imageList: {}, // 存取所有图片集合
      percentage: 0, // 进度
      selectView: null,
      selectTool: '',
      crossStatus: false, // 十字线状态
      measureStatus: '',
      colorIndex: '',
      colorStatus: false,
      viewStatus: true,
      niftiNum: 4,
      timeSlices: 0, //volume 值
      echartStatus: false,
      niftiStatus: true,
      /* 底部坐标值 */
      imagX: '',
      imagY: '',
      imagZ: '',
      imgVal: 0, // 点击val值
      currentThanLayers: '', // 当前图层/全部图层
      loading: false,
      /* echarts 数据 */
      optionEcharts: {
        backgroundColor: '#333',
        color: '#0070F5',
        xAxis: [
          {
            axisLine: {
              lineStyle: {
                color: '#5b5b5b',
              },
            },
            axisLabel: {
              interval: 10,
            },
            type: 'category',
            data: [0],
          },
        ],
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: 30,
          right: 30,
          bottom: 8,
          top: 30,
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          min: 0,
          axisLine: {
            lineStyle: {
              color: '#5b5b5b',
            },
          },
          splitLine: {
            lineStyle: {
              color: ['#5b5b5b'],
            },
          },
        },
        series: [
          {
            data: [0],
            symbol: 'none',
            type: 'line',
          },
        ],
      },
      myChart: null,
      parXYZ: {}, // 鼠标移动图层转换后的坐标
      spliceList: [], // 切片数组
      splicePrecent: 0, // 处理全部切片进度
      imageMark: [],
      imageMarkCopy: [],
    };
  },
  watch: {
    /**
     * @description: 监听图层变化，获取当前图层标注信息
     * @param {type}
     * @return {type}
     */
    selectView() {
      let list = this.getRecords(this.imageMarkCopy, 1);

      if (list && list.length !== 0) {
        this.enableTools(false);
      }
    },
  },
  mounted() {
    /* 颜色列表 */
    this.colorlist = cornerstone.colors.getColormapsList();
    this.colorlist.forEach((item) => {
      item['status'] = false;
    });
    /* 进度条监测 */
    let that = this;

    cornerstone.events.addEventListener(
      'cornerstoneimageloadprogress',
      function(event) {
        const eventData = event.detail;

        setTimeout(() => {
          that.percentage = eventData.percentComplete;
          if (eventData.percentComplete === 100 && that.niftiNum === 4) {
            /* 进度条加载到100%，默认加载到第一个 */
            that.clickView('nifti-imagex');
            that.allReload();
          }
        }, 500);
      }
    );
    /* 监听鼠标滚轮事件 */
    window.addEventListener('mousewheel', this.handleScroll);
    /* 点击获取volume值 */
    window.addEventListener('mousedown', function(e) {
      that.mouseDownHandler(e);
    });
    /* 获取x，y，z值 */
    window.addEventListener('mousemove', function(e) {
      that.mouseMoveHandler(e);
    });
    this.loading = true;
    /* 开始加载 */
    this.initNiftiData(this.url);
    /* 获取右侧面板 */
    window.addEventListener('mouseup', function(e) {
      that.mouseUpHandler(e);
    });
  },
  methods: {
    /**
     * @description: 文件上传钩子
     * @param {*}
     * @return {*}
     */
    handlePreview() {
      // this.initNiftiData(file);
    },
    /**
     * @description: 解决十字线不准缺，默认图层加载时切换全部图层
     * @param {*}
     * @return {*}
     */
    allReload() {
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      let that = this;

      data.forEach((item) => {
        let element = that.getElement(item);

        let images = that.imageList[item];

        let num = images.num;

        let number = images.imageIds.length;

        for (let i = 0; i < number; i++) {
          if (i === number) {
            return;
          }
          that.scrollElementToIndex(element, i);
        }
        that.scrollElementToIndex(element, num);
      });
    },
    /**
     * @description: 右侧失去焦点同步Title
     * @param {*}
     * @return {*}
     */
    blurTitle(item) {
      this.imageMarkCopy.forEach((ele) => {
        if (ele.id === item.id) {
          ele.title = item.title;
        }
      });
    },
    /**
     * @description: 鼠标移入指标评估显示高亮
     * @param {type}
     * @return {type}
     */
    enterOrLeaveTool(item, status) {
      let toolStateManager = cornerstoneTools.getElementToolStateManager(
        this.element
      );

      let that = this;

      /* 鼠标移入，先删除再添加 */
      item.data.active = status;
      cornerstoneTools.removeToolState(this.element, item.type, item.data);
      toolStateManager.add(this.element, item.type, item.data);
      cornerstoneToolsCore.setToolPassive(item.type);
      cornerstone.updateImage(this.element);
      if (!status) {
        /* 鼠标离开当前card，开始回填到原始 */
        that.imageMark.forEach((val) => {
          let arrIndex = that.imageMarkCopy.findIndex((item2) => {
            return item2.id === val.id;
          });

          if (arrIndex && arrIndex !== -1) {
            that.imageMarkCopy[arrIndex].title = val.title;
          }
        });
        return (item.status = true);
      }
    },
    /**
     * @description: 右侧记录面板
     * @param {type}
     * @return {type}
     */
    recordTab() {
      this.tabStatus = !this.tabStatus;
      this.closeTools();
    },
    /**
     * @description: 去除所有工具状态
     * @param {*}
     * @return {*}
     */
    closeTools() {
      this.measureList.forEach((item) => {
        item.status = false;
      });
      this.measureStatus = false;
      cornerstoneToolsCore.setToolEnabled(this.selectTool);
      this.toolList.forEach((element) => {
        element.status = false;
      });
      this.selectTool = null;
    },
    /**
     * @description: 获取右侧面板,此处不做鼠标移入位置判断
     * @param {type}
     * @return {type}
     */
    mouseUpHandler(e) {
      if (!(this.percentage === 100 && this.element)) {
        return;
      }
      let ii = 0;

      e.path.forEach((item) => {
        if (item.className === 't-main') {
          ii++;
        }
      });
      /* 十字线不绘制 */
      if (
        ii === 0 ||
        this.selectTool === 'cross' ||
        e.path[0].localName === 'input'
      ) {
        return;
      }
      let that = this;

      let id = this.element.id;

      let id2 = e.path[1].id;

      let idIndex = id === id2 ? id : id2;

      if (!id2) {
        idIndex = id;
      }
      /* 获取当前页面是否含有 */
      let element = this.getElement(idIndex);

      this.imageMark = this.unFlodPanel(element);
      /* 判断是否存在橡皮擦，如果存在开始删除 */
      let data = this.$_.cloneDeep(this.imageMarkCopy);

      let num = this.imageList[idIndex].num;

      let list = [];

      let list3 = [];
      /* 单次点击确认 */

      data.forEach((item) => {
        let arrIndex = that.imageMark.findIndex((item2) => {
          return item2.id === item.id;
        });

        if (arrIndex !== -1) {
          item.value = that.imageMark[arrIndex].value;
          item.data = that.imageMark[arrIndex].data;
        }
        if (
          num === item.index &&
          idIndex === item.typeDicom &&
          this.num === item.volume
        ) {
          list.push(item);
        } else {
          list3.push(item);
        }
      });
      let list2 = [];

      list.forEach((item) => {
        if (that.imageMark.length === 0 && e.path[1].className !== 't-main') {
          return list2.push(item);
        }
        let arrIndex = that.imageMark.findIndex((item2) => {
          return item2.id === item.id;
        });

        if (arrIndex !== -1) {
          list2.push(item);
        }
      });

      /* 分类，如果当前图层没有，原始图层有则删除 */
      if (this.selectTool === 'Eraser') {
        list2 = this.imageMark;
      }
      this.imageMarkCopy = [...list3, ...list2];
    },
    /**
     * @description: 删除右侧面板
     * @param {type}
     * @return {type}
     */
    deleteTool(item, index) {
      cornerstoneTools.removeToolState(this.element, item.type, item.data);
      /* 删除原始数据 */
      let arrIndex = this.imageMarkCopy.findIndex((item2) => {
        return item2.id === item.id;
      });

      this.imageMarkCopy.splice(arrIndex, 1);
      this.imageMark.splice(index, 1);
      cornerstone.updateImage(this.element);
      // 点击删除，重新选择工具
      this.measureList.forEach((item2) => {
        item2.status = false;
      });
      this.measureStatus = false;
      this.selectTool = null;
      return (item.status = false);
    },
    /**
     * @description: 获取右侧面板记录
     * @param {type}
     * @return {type}
     */
    getRecords(data, status) {
      let num = this.imageList[this.selectView].num;

      if (data.length === 0 || this.selectTool === 'cross') {
        return;
      }
      let toolStateManager = cornerstoneTools.getElementToolStateManager(
        this.element
      );

      /* 更新title */
      this.imageMarkCopy.forEach((val) => {
        let arrIndex = this.imageMark.findIndex((item2) => {
          return item2.id === val.id;
        });

        if (arrIndex && arrIndex !== -1) {
          this.imageMark[arrIndex].title = val.title;
        }
      });
      /* 获取当前页面是否含有 */
      this.imageMark = this.unFlodPanel(this.element);
      /* 没有当前，从原始数据中读取，并写入 */
      if (this.imageMark && this.imageMark.length === 0) {
        let list = [];

        data.forEach((item) => {
          if (
            status === 1 &&
            this.selectView === item.typeDicom &&
            num === item.index &&
            this.num === item.volume
          ) {
            list.push(item);
            item.data.active = false;
            toolStateManager.add(this.element, item.type, item.data);
            cornerstoneToolsCore.setToolPassive(item.type);
          }
        });
        cornerstone.updateImage(this.element, true);
        return (this.imageMark = list);
      }
    },
    /**
     * @description: 右侧面板展开
     * @param {type}
     * @return {type}
     */
    unFlodPanel(val) {
      if (this.percentage === 100 && val) {
        /* 获取面板信息 */
        const enabledElement = cornerstone.getEnabledElement(val);
        const {
          toolState,
        } = cornerstoneTools.globalImageIdSpecificToolStateManager;

        const imageIdToolState = toolState[enabledElement.image.imageId];

        let id = val.id;

        if (
          !(
            id === 'nifti-imagex' ||
            id === 'nifti-imagey' ||
            id === 'nifti-imagez'
          )
        ) {
          return;
        }
        if (!imageIdToolState) {
          return [];
        }
        let measurementsToRemove = [];

        Object.keys(imageIdToolState).forEach((toolType) => {
          const { data } = imageIdToolState[toolType];

          data.forEach((measurementData) => {
            if (toolType === 'Angle') {
              measurementsToRemove.push({
                title: '',
                value: 'Angle：' + measurementData.rAngle + '°',
                type: toolType,
                id: measurementData.uuid,
                typeDicom: id,
                status: true,
                volume: this.num,
                index: this.imageList[val.id].num, // 坐标值非数量值
                data: measurementData,
              });
            } else if (toolType === 'Length') {
              measurementsToRemove.push({
                title: '',
                value:
                  'Length：' +
                  measurementData.length.toFixed(2) +
                  measurementData.unit,
                type: toolType,
                volume: this.num,
                id: measurementData.uuid,
                status: true,
                typeDicom: id,
                index: this.imageList[val.id].num,
                data: measurementData,
              });
            } else if (
              toolType === 'EllipticalRoi' ||
              toolType === 'RectangleRoi'
            ) {
              measurementsToRemove.push({
                title: '',
                value:
                  'Mean：' +
                  measurementData.cachedStats.mean.toFixed(2) +
                  '，Std Dev：' +
                  measurementData.cachedStats.stdDev.toFixed(2),
                type: toolType,
                status: true,
                volume: this.num,
                id: measurementData.uuid,
                typeDicom: id,
                index: this.imageList[val.id].num,
                data: measurementData,
              });
            } else {
              measurementsToRemove.push({
                title: '',
                value: 'Text：' + measurementData.text,
                type: toolType,
                id: measurementData.uuid,
                status: true,
                volume: this.num,
                typeDicom: id,
                index: this.imageList[val.id].num,
                data: measurementData,
              });
            }
          });
        });

        let list = [];

        let that = this;

        measurementsToRemove.forEach((item) => {
          /* 去除underfind */
          if (item.value.indexOf('undefined') !== -1) {
            item.value = null;
          }
          let arrIndex = that.imageMarkCopy.findIndex((item2) => {
            return item2.id === item.id;
          });

          let arrIndex2 = that.imageMark.findIndex((item2) => {
            return item2.id === item.id;
          });

          if (arrIndex === -1) {
            list.push(item);
          }
          if (arrIndex2 !== -1) {
            return (item.title = that.imageMark[arrIndex2].title);
          }
          if (arrIndex !== -1) {
            item.title = that.imageMarkCopy[arrIndex].title;
          }
        });
        this.imageMarkCopy = [...this.imageMarkCopy, ...list];
        return measurementsToRemove;
      }
    },
    /**
     * @description: 关闭切片弹窗
     * @param {type}
     * @return {type}
     */
    handleClose() {
      this.visable = false;
      this.spliceList = [];
    },
    /**
     * @description: 切片弹窗
     * @param {type}
     * @return {type}
     */
    sliceImage() {
      let that = this;

      this.splicePrecent = 0;
      const imageIds = this.imageList[this.selectView].imageIds;

      this.spliceList = imageIds;
      that.visable = true;
      setTimeout(() => {
        this.splicePrecent = 1;
        imageIds.forEach((item, i) => {
          setTimeout(() => {
            let num = (i / imageIds.length) * 100;

            this.splicePrecent = Math.round(num);
            if (i === imageIds.length - 1) {
              return (this.splicePrecent = 100);
            }
          }, 100);
          this.sliceDatas('d-dicom' + i, item);
        });
      }, 100);
    },
    /**
     * @description: 渲染每个切片数据
     * @param {type}
     * @return {type}
     */
    sliceDatas(id, url) {
      let element = document.getElementById(id);

      cornerstone.enable(element);
      cornerstone.loadAndCacheImage(url).then((image) => {
        cornerstone.displayImage(element, image);
        cornerstone.convertToFalseColorImage(element, 'gray');
        cornerstone.updateImage(element, true);
        cornerstone.reset(element);
      });
    },
    /**
     * @description: 切换volume
     * @param {type}
     * @return {type}
     */
    changeVolume(val) {
      if (!(this.percentage === 100)) {
        return;
      }
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];
      /* 切换volume 去除重新选择十字线 */

      if (this.selectTool === 'cross') {
        this.clearCross(data);
        this.toolList[8].status = false;
      }
      /* 坐标从0开始 */
      let index = this.$_.cloneDeep(val - 1);

      /*切换volume重新绘制echarts ,所有t将会改变  */
      let dataX = this.$_.cloneDeep(this.imageList['nifti-imagex']);

      let dataY = this.$_.cloneDeep(this.imageList['nifti-imagey']);

      let dataZ = this.$_.cloneDeep(this.imageList['nifti-imagez']);

      let imageX = [];

      dataX.imageIds.forEach((item) => {
        let start = item.indexOf('t-');

        let par = item.substring(0, start + 2);

        // eslint-disable-next-line no-param-reassign
        item = par + index;
        imageX.push(item);
      });
      let imageY = [];

      dataY.imageIds.forEach((item) => {
        let start = item.indexOf('t-');

        let par = item.substring(0, start + 2);

        // eslint-disable-next-line no-param-reassign
        item = par + index;
        imageY.push(item);
      });
      let imageZ = [];

      dataZ.imageIds.forEach((item) => {
        let start = item.indexOf('t-');

        let par = item.substring(0, start + 2);

        // eslint-disable-next-line no-param-reassign
        item = par + index;
        imageZ.push(item);
      });
      this.imageList['nifti-imagex'].imageIds = imageX;
      this.imageList['nifti-imagey'].imageIds = imageY;
      this.imageList['nifti-imagez'].imageIds = imageZ;
      let that = this;

      data.forEach((item) => {
        let ele = this.getElement(item);

        let i = this.imageList[item].num;

        let imageIds = this.imageList[item].imageIds;

        cornerstone.loadAndCacheImage(imageIds[i]).then((image) => {
          /* 切换volume上色 */
          cornerstone.displayImage(ele, image);
          if (that.colorIndex) {
            cornerstone.convertToFalseColorImage(ele, that.colorIndex);
            cornerstone.updateImage(ele, true);
          }
        });
      });
      setTimeout(() => {
        this.allReload(true);
      }, 200);
    },
    /**
     * @description: 监听鼠标移动事件
     * @param {type}
     * @return {type}
     */
    mouseMoveHandler(e) {
      if (!(this.percentage === 100 && this.element)) {
        return;
      }
      let par = cornerstone.pageToPixel(this.element, e.pageX, e.pageY);

      par.x = Math.round(par.x);
      par.y = Math.round(par.y);
      let that = this;

      if (
        this.selectView === 'nifti-imagex' &&
        e.path[1].id === 'nifti-imagex'
      ) {
        this.imagX = this.imageList[this.selectView].num;
        this.imagY = par.y < 0 ? 0 : par.x;
        this.imagZ = par.y < 0 ? 0 : par.y;
      } else if (
        this.selectView === 'nifti-imagey' &&
        e.path[1].id === 'nifti-imagey'
      ) {
        this.imagY = this.imageList[this.selectView].num;
        this.imagX = par.y < 0 ? 0 : par.x;
        this.imagZ = par.y < 0 ? 0 : par.y;
      } else if (
        this.selectView === 'nifti-imagez' &&
        e.path[1].id === 'nifti-imagez'
      ) {
        this.imagZ = this.imageList[this.selectView].num;
        this.imagX = par.y < 0 ? 0 : par.x;
        this.imagY = par.y < 0 ? 0 : par.y;
      }
      this.parXYZ = par;
      /* 移动或点击，入如果发现十字线功能存在，对其他几个视图做处理 */
      if (this.selectTool === 'cross') {
        let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

        data.forEach((item) => {
          let ele = that.getElement(item);

          if (that.colorIndex) {
            cornerstone.convertToFalseColorImage(ele, that.colorIndex);
            cornerstone.updateImage(ele, true);
          }
        });
      }
    },
    /**
     * @description: 点击获取volume
     * @param {type}
     * @return {type}
     */
    mouseDownHandler(e) {
      /* 点击判断 */
      if (!(this.percentage === 100 && this.element)) {
        return;
      }
      let id = e.path[1].id;

      if (id && id !== this.element.id) {
        return;
      }
      if (
        !(
          id === 'nifti-imagex' ||
          id === 'nifti-imagey' ||
          id === 'nifti-imagez'
        )
      ) {
        return;
      }
      /* 移动或点击，入如果发现十字线功能存在，对其他几个视图做处理 */
      if (this.selectTool === 'cross') {
        this.getImageIndex(e);
        let data2 = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

        let that = this;

        data2.forEach((item) => {
          let ele = this.getElement(item);

          if (that.colorIndex) {
            cornerstone.convertToFalseColorImage(ele, that.colorIndex);
            cornerstone.updateImage(ele, true);
          }
          if (this.selectView === item) {
            return;
          }
        });
      }
      let that = this;

      /* 路径前置条件 */
      let data = this.imageList[id];

      let imageIds = data.imageIds;

      let index = data.num;

      let url = imageIds[index];

      let i = 0;

      let image = data.image;

      let parXYZ = cornerstone.pageToPixel(this.element, e.pageX, e.pageY);

      parXYZ.x = Math.round(parXYZ.x);
      parXYZ.y = Math.round(parXYZ.y);
      that.parXYZ = parXYZ;
      if (
        that.parXYZ.y > image.height ||
        that.parXYZ.x < 0 ||
        that.parXYZ.x > image.width
      ) {
        i = -1;
      } else {
        i = image.columns * that.parXYZ.y + that.parXYZ.x;
      }
      let start = url.indexOf('t-');

      let par = url.substring(0, start + 2) + 0;

      if (i > 0) {
        // eslint-disable-next-line no-loop-func
        cornerstone.loadAndCacheImage(par).then((img) => {
          let pixelData = img.getPixelData();

          that.imgVal = pixelData[i];
        });
      } else {
        return (that.imgVal = 0);
      }
      if (!this.echartStatus) {
        return;
      }
      let tools = [
        'play',
        'Zoom',
        'ArrowAnnotate',
        'Eraser',
        'Length',
        'Angle',
        'EllipticalRoi',
        'RectangleRoi',
        'Wwwc',
      ];
      /* 存在冲突工具不在操作echarts */

      if (tools.indexOf(this.selectTool) !== -1) {
        return;
      }
      /* 获取当前点所有页面，绘制成图标 */
      let yData = [];

      let xData = [];

      for (let x = 0; x < this.timeSlices; x++) {
        let par2 = url.substring(0, start + 2) + x;

        // eslint-disable-next-line no-loop-func
        cornerstone.loadAndCacheImage(par2).then((img) => {
          let pixelData = img.getPixelData();

          if (index === x) {
            that.imgVal = pixelData[i];
          }
          yData.push(pixelData[i]);
          xData.push(x);
          if (x === that.timeSlices - 1) {
            that.updateEcharts(xData, yData);
          }
        });
      }
    },
    /**
     * @description: 图标初始化
     * @param {type}
     * @return {type}
     */
    echarts() {
      if (!this.echartStatus) {
        this.myChart = null;
        return;
      }
      this.myChart = echarts.init(document.getElementById('echarts'));

      this.myChart.setOption(this.optionEcharts);
    },
    /**
     * @description: 自适应
     * @param {type}
     * @return {type}
     */
    resetImage() {
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      data.forEach((item) => {
        let ele = this.getElement(item);

        cornerstone.resize(ele, true);
      });
    },
    /**
     * @description: 更新图表
     * @param {type}
     * @return {type}
     */
    updateEcharts(xData, yData) {
      let options = this.$_.cloneDeep(this.optionEcharts);

      let min = Math.min(...yData);

      let max = Math.max(...xData);

      options.series[0].data = yData;
      options.xAxis[0].data = xData;
      options.yAxis.min = min;
      if (max <= 10) {
        options.xAxis[0].axisLabel.interval = 1;
      } else {
        options.xAxis[0].axisLabel.interval = 10;
      }
      this.myChart.setOption(options, true);
    },
    /**
     * @description:鼠标滚轮事件
     * @param {type}
     * @return {type}
     */
    handleScroll(e) {
      if (e && e.path[0].className === 'w-main') {
        return (this.rowResultStatus = false);
      }
      if (
        !(this.percentage === 100 && this.element && this.selectTool !== 'play')
      ) {
        return;
      }
      this.toolList[0].status = false;
      let ele = this.element;

      /* 鼠标滚动，如果有颜色，就上色 */
      if (this.colorIndex) {
        cornerstone.convertToFalseColorImage(ele, this.colorIndex);
        cornerstone.updateImage(ele, true);
      }
      cornerstone.reset(ele);
      this.getImageIndex(e);
      /* 判断滚动事件，回填指标评估 */
      let id = e.path[1].id;

      if (id === this.selectView) {
        /* 获取当前页面是否含有 */
        this.imageMark = this.unFlodPanel(this.element);
        /* 如果没有，在从数据里写进去 */
        if (this.imageMark && this.imageMark.length === 0) {
          let list = this.getRecords(this.imageMarkCopy, 1);

          if (list && list.length !== 0) {
            this.enableTools(false);
          }
        }
      }
    },
    /**
     * @description: 鼠标滚动获取数据
     * @param {type}
     * @return {type}
     */
    getImageIndex(e) {
      let id =
        e.path[1].id === this.element.id ? this.element.id : e.path[1].id;

      this.element = this.getElement(id);
      if (this.selectTool === 'cross') {
        this.selectView = id;
      }
      /* 滚轮坐标值更改 */
      const stackData = cornerstoneToolsCore.getToolState(
        this.element,
        'stack'
      );

      const { currentImageIdIndex } = stackData.data[0];

      if (
        this.selectView === 'nifti-imagex' &&
        e.path[1].id === 'nifti-imagex'
      ) {
        this.imagX = currentImageIdIndex;
      } else if (
        this.selectView === 'nifti-imagey' &&
        e.path[1].id === 'nifti-imagey'
      ) {
        this.imagY = currentImageIdIndex;
      } else if (
        this.selectView === 'nifti-imagez' &&
        e.path[1].id === 'nifti-imagez'
      ) {
        this.imagZ = currentImageIdIndex;
      }
      this.imageList[this.selectView].num = currentImageIdIndex;
      this.currentThanLayers =
        currentImageIdIndex +
        1 +
        ' / ' +
        this.imageList[this.selectView].imageIds.length;
    },
    /**
     * @description: 获取视图
     * @param {type}
     * @return {type}
     */
    changeView(val, index) {
      this.niftiNum = val.num;
      this.viewStatus = true;
      /* 切换视图，仅去除定时 */
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      clearInterval(this.timeInterval);
      if (val.num !== 4) {
        this.selectView = val.value;
        let ele = this.getElement(val.value);

        this.element = ele;
        setTimeout(() => {
          cornerstone.resize(ele, true);
        }, 100);
      } else {
        this.selectView = null;
        this.element = null;
        this.niftiStatus = false;
        this.clearCross(data);
        this.toolList[8].status = false;
        setTimeout(() => {
          this.niftiStatus = true;
          setTimeout(() => {
            this.initNiftiData(this.url);
            this.enableTools();
          }, 100);
        }, 100);
      }

      this.viewList.forEach((item) => {
        item.status = false;
      });
      this.viewList[index].status = true;
    },
    /**
     * @description: 切换视图，更新当前图层
     * @param {type}
     * @return {type}
     */
    enableTools(val) {
      let data = [
        'ArrowAnnotate',
        'RectangleRoi',
        'EllipticalRoi',
        'Angle',
        'Length',
      ];

      if (val !== false) {
        this.measureList.forEach((item) => {
          item.status = false;
        });
        this.measureStatus = false;
      }
      data.forEach((item) => {
        const toolName = cornerstoneToolsCore[`${item}Tool`];

        cornerstoneToolsCore.addTool(toolName);
        cornerstoneToolsCore.setToolEnabled(item);
      });
      if (this.selectTool) {
        cornerstoneToolsCore.setToolActive(this.selectTool, {
          mouseButtonMask: 1,
        });
      }
    },
    /**
     * @description: 上色工具和其他工具并不冲突，包括定时
     * @param {type}
     * @return {type}
     */
    colorMap(color, index) {
      if (!color) {
        return;
      }
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      this.colorIndex = color;
      this.colorStatus = true;

      let colors = this.$_.cloneDeep(this.colorlist);

      colors.forEach((item) => {
        item.status = false;
      });
      colors[index].status = true;

      data.forEach((item) => {
        let ele = this.getElement(item);

        cornerstone.convertToFalseColorImage(ele, color);
        cornerstone.updateImage(ele, true);
        cornerstone.reset(ele);
      });
      this.colorlist = colors;
    },
    /**
     * @description: 头部度量工具
     * @param {type}
     * @return {type}
     */
    clickInstros(val, index) {
      /* 清空，去除，初次校验，十字线等 */
      this.clearTime();
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      this.clearCross(data);
      let tool = val.value;

      if (!(this.percentage === 100 && this.element)) {
        return;
      }

      this.measureList.forEach((item) => {
        item.status = false;
      });
      this.toolList.forEach((item) => {
        item.status = false;
      });
      /* 去除重复工具 */
      if (this.selectTool === tool) {
        this.measureStatus = null;
        this.selectTool = null;
        return cornerstoneToolsCore.setToolEnabled(tool);
      }
      this.selectTool = tool;

      this.measureList[index].status = true;
      this.measureStatus = true;
      const toolName = cornerstoneToolsCore[`${tool}Tool`];

      cornerstoneToolsCore.addTool(toolName);
      cornerstoneToolsCore.setToolActive(tool, { mouseButtonMask: 1 });
    },
    /**
     * @description: 清除定时，关闭播放
     * @param {type}
     * @return {type}
     */
    clearTime() {
      this.selectTool = null;
      clearInterval(this.timeInterval);
    },
    /**
     * @description: 工具栏
     * @param {val} 工具类
     * @param {index} 工具坐标
     * @return {type}
     */
    clickTools(val, index) {
      let tool = val.value;

      /* 未加载完，所有工具均不可使用，避免一切加载bug */
      if (tool !== 'cross' && tool !== 'echarts') {
        if (!(this.percentage === 100 && this.element)) {
          return;
        }
      }
      /* 还原工具状态 */
      this.toolList.forEach((item) => {
        if (item.value !== 'echarts') {
          item.status = false;
        }
      });
      this.measureList.forEach((item) => {
        item.status = false;
      });
      this.measureStatus = null;
      if (
        this.selectView &&
        this.selectTool !== 'cross' &&
        this.selectTool !== 'slice'
      ) {
        /* 工具重复点击还原，点击当前，去除上一次工具 */
        cornerstoneToolsCore.setToolEnabled(this.selectTool);
      }
      if (
        this.selectTool === tool &&
        !(
          tool === 'hflip' ||
          tool === 'vflip' ||
          tool === 'cross' ||
          tool === 'echarts' ||
          tool === 'slice'
        )
      ) {
        return this.clearTime(tool);
      }
      this.selectTool = tool;
      let element = this.element;

      this.toolList[index].status = true;
      let data = ['nifti-imagex', 'nifti-imagey', 'nifti-imagez'];

      /* 激活工具 */
      if (tool === 'play') {
        this.clearCross(data);
        return this.playTool();
      } else if (tool === 'slice') {
        this.sliceImage();
        this.toolList[index].status = false;
      } else if (tool === 'Zoom') {
        this.clearCross(data, false);
        /* 放大缩小 */
        const toolName = cornerstoneToolsCore.ZoomTool;

        cornerstoneToolsCore.addTool(toolName, {
          configuration: {
            invert: false,
            preventZoomOutsideImage: false,
            minScale: 1.0,
            maxScale: 20.0,
          },
        });
        cornerstoneToolsCore.setToolActive(tool, { mouseButtonMask: 1 });
      } else if (tool === 'hflip' || tool === 'vflip') {
        /* 左右翻转 */
        const viewport = cornerstone.getViewport(element);

        viewport[tool] = !viewport[tool];
        cornerstone.setViewport(element, viewport);
        cornerstone.updateImage(element);
        this.toolList[index].status = false;
        this.clearCross(data, false);
        this.toolList[index].status = false;
      } else if (tool === 'reset') {
        cornerstone.reset(element);
        this.toolList[index].status = false;
      } else if (tool === 'echarts') {
        this.$nextTick(() => {
          this.echarts();
        });
        setTimeout(() => {
          this.resetImage();
        }, 300);
        /* volume 为0不允许使用图表 */
        if (this.timeSlices === 1) {
          return (this.toolList[index].status = false);
        }
        this.echartStatus = !this.echartStatus;
        this.clearCross(data);
        this.toolList[index].status = this.echartStatus;
        return;
      } else if (tool === 'cross') {
        if (this.crossStatus) {
          this.clearCross(data, false);
          return (this.toolList[index].status = false);
        }
        this.crossStatus = true;
        /* 十字线工具 */
        data.forEach((item) => {
          let ele = this.getElement(item);

          synchronizer.add(ele);
          cornerstoneToolsMain.stackPrefetch.enable(ele);
          cornerstoneToolsMain.referenceLines.tool.enable(ele, synchronizer);
          cornerstoneToolsMain.crosshairs.enable(ele, 1, synchronizer);
        });
      } else {
        this.clearCross(data, false);
        const toolName = cornerstoneToolsCore[`${tool}Tool`];

        cornerstoneToolsCore.addTool(toolName);
        cornerstoneToolsCore.setToolActive(tool, { mouseButtonMask: 1 });
      }

      clearInterval(this.timeInterval);
      /* 添加到图层 */
    },
    /**
     * @description: 播放工具
     * @param {type}
     * @return {type}
     */
    playTool() {
      /* 获取当前位值图片 */
      let images = this.imageList[this.selectView];

      const { currentImageIdIndex, imageIds } = images;

      let index = currentImageIdIndex;

      // let that = this;

      this.timeInterval = setInterval(() => {
        if (index === imageIds.length) {
          index = 0;
        } else {
          index = index + 1;
        }
        this.imageList[this.selectView].num = index;
        this.currentThanLayers = index + ' / ' + imageIds.length;
        /* 获取坐标 */
        if (this.selectView === 'nifti-imagex') {
          this.imagX = index - 1;
        } else if (this.selectView === 'nifti-imagey') {
          this.imagY = index - 1;
        } else if (this.selectView === 'nifti-imagez') {
          this.imagZ = index - 1;
        }

        this.scrollElementToIndex(this.element, index);
      }, 1000);
    },
    /**
     * @description: 点击视图操作
     * @param {type}
     * @return {type}
     */
    clickView(val) {
      if (!(this.percentage === 100)) {
        return;
      }
      let element = this.getElement(val);

      if (this.selectView && val !== this.selectView) {
        let ele = this.getElement(this.selectView);

        cornerstoneToolsMain.stackScrollWheel.disable(ele);
      }
      this.selectView = val;
      /* 点击切换视图 */
      this.element = element;
      cornerstoneToolsMain.stackScrollWheel.activate(element);
      this.currentThanLayers =
        this.imageList[val].num +
        1 +
        ' / ' +
        this.imageList[val].imageIds.length;
      /* 获取坐标 */
      if (val === 'nifti-imagex') {
        this.imagX = this.imageList[this.selectView].num;
      } else if (val === 'nifti-imagey') {
        this.imagY = this.imageList[this.selectView].num;
      } else if (val === 'nifti-imagez') {
        this.imagZ = this.imageList[this.selectView].num;
      }
    },
    /**
     * @description: 切换其他工具，清楚十字线
     * @param {type}
     * @return {type}
     */
    clearCross(data, val2) {
      data.forEach((item) => {
        let ele = this.getElement(item);

        synchronizer.remove(ele);
        cornerstoneToolsMain.stackPrefetch.disable(ele);
        cornerstoneToolsMain.referenceLines.tool.disable(ele, synchronizer);
        cornerstoneToolsMain.crosshairs.disable(ele, 1, synchronizer);
        setTimeout(() => {
          if (val2 !== false) {
            cornerstone.reset(ele);
          }
        });
      });
      this.crossStatus = false;
    },
    /**
     * @description: 影像数据获取
     * @param {type}
     * @return {type}
     */
    initNiftiData(val) {
      this.loadAndViewImage(`nifti:${val + '#x,t-0'}`, 'nifti-imagex');
      this.loadAndViewImage(`nifti:${val + '#y,t-0'}`, 'nifti-imagey');
      this.loadAndViewImage(`nifti:${val + '#z,t-0'}`, 'nifti-imagez');
    },
    /**
     * @description: 获取指定element
     * @param {type}
     * @return {type}
     */
    getElement(val) {
      return document.getElementById(val);
    },
    /**
     * @description: 跳转指定图层
     * @param {type}
     * @return {type}
     */
    scrollElementToIndex(element, index) {
      const toolImport = cornerstoneToolsCore.import;
      const scrollToIndex = toolImport('util/scrollToIndex');

      scrollToIndex(element, index);
      if (!this.colorIndex) {
        return;
      }
      /* 播放上色 */
      setTimeout(() => {
        cornerstone.convertToFalseColorImage(element, this.colorIndex);
        cornerstone.updateImage(element, true);
      });
    },
    /**
     * @description: 文件渲染处理
     * @param {type}
     * @return {type}
     */
    loadAndViewImage(imageId, val) {
      let that = this;

      let element = this.getElement(val);

      cornerstone.enable(element);
      const imageIdObject = ImageId.fromURL(imageId);

      cornerstone.loadAndCacheImage(imageIdObject.url).then(function(image) {
        that.loading = false;
        /* 图片加载初始化值 */
        const numberOfSlices = cornerstone.metaData.get(
          'multiFrameModule',
          imageIdObject.url
        ).numberOfFrames;

        const timeSlices = cornerstone.metaData.get(
          'functional',
          imageIdObject.url
        );

        /* 获取volume的值 */
        that.timeSlices = timeSlices.timeSlices;
        const stack = {
          currentImageIdIndex: imageIdObject.slice.index,
          imageIds: Array.from(
            Array(numberOfSlices),
            (_, i) =>
              `nifti:${imageIdObject.filePath}#${imageIdObject.slice.dimension}-${i},t-0`
          ),
        };
        const viewport = cornerstone.getDefaultViewportForImage(element, image);

        /* 渲染加载 */
        cornerstone.displayImage(element, image, viewport);
        /* 工具添加 */
        cornerstoneToolsMain.addStackStateManager(element, ['stack']);
        cornerstoneToolsMain.addToolState(element, 'stack', stack);
        cornerstoneToolsMain.orientationMarkers.enable(element);

        const stackData = cornerstoneToolsCore.getToolState(element, 'stack');
        const { imageIds } = stackData.data[0];

        /* 存储数据 */
        that.imageList[val] = stackData.data[0];
        let num = Math.round(imageIds.length / 2);

        that.imageList[val].num = num - 1; // 长度值非实际值
        that.imageList[val].image = image;
        that.scrollElementToIndex(element, num - 1);
        /* 鼠标滚动，如果有颜色，就上色 */
        if (that.colorIndex) {
          cornerstone.convertToFalseColorImage(element, that.colorIndex);
          cornerstone.updateImage(element, true);
          cornerstone.reset(element);
        }
      });
    },
  },
};
</script>
<style lang="scss">
/* flex 居中3 */
@mixin fcc {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* flex 居中3 */
@mixin fh {
  display: flex;
  align-items: center;
}
@mixin el {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.dicom-main {
  height: 100%;
  width: 100%;
  min-width: 1366px;
  background: #f5f7fa;
  .dialog {
    .el-dialog {
      border: 2px solid #262626;
    }
    .el-dialog__header {
      background: #333;
      height: 48px;
      line-height: 48px;
      padding: 0 10px;
      font-weight: 550;
      .el-dialog__title {
        color: white;
        font-weight: 500;
      }
      .el-dialog__headerbtn {
        top: 15px;
        right: 15px;
        .el-dialog__close {
          color: white;
          font-size: 23px;
        }
      }
    }
    .el-dialog__body {
      min-height: 300px;
      background: black;
      max-height: 700px;
      overflow: auto;
      padding: 0;
      position: relative;
      .g-dis {
        position: absolute;
        width: 100%;
      }
      .g-main {
        width: 100%;
        overflow: auto;
        flex-wrap: wrap;
        display: flex;
        .d-dicom {
          width: 150px;
          height: 150px;
          .m-image {
            width: 150px;
            height: 150px;
          }
        }
      }
    }
    /* 设置滚动条样式 */
    .el-dialog__body::-webkit-scrollbar {
      width: 3px;
      height: 10px;
      background: #262626;
    }
    .el-dialog__body::-webkit-scrollbar-thumb {
      border-radius: 0;
      background: #737373;
    }
    .el-dialog__footer {
      display: none;
    }
  }
  .dialog2 {
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 16px;
      font-size: 18px;
      background: #0070f5;
    }
    .el-dialog__title {
      color: rgba(255, 255, 255, 0.85);
    }
    .el-dialog__headerbtn {
      top: 15px;
      right: 15px;
      .el-dialog__close {
        color: white;
        font-size: 23px;
      }
    }
    .el-dialog__body {
      padding: 0;
      .g-submit {
        padding: 4px 16px;
        box-sizing: border-box;
        line-height: initial;
        .t-title {
          height: 56px;
          @include fh;
          color: #ce2200;
        }
        .e-center {
          color: rgba(0, 0, 0, 0.85);
          justify-content: center;
          height: 32px;
        }
        .r-top {
          margin-top: 16px;
        }
        .r-bot {
          margin-bottom: 16px;
        }
        .t-row {
          height: 40px;
          @include fh;
          span {
            display: inline-block;
            width: 33%;
            text-align: center;
            @include el;
          }
        }
        .w-bck {
          background: #f5f5f5;
        }
        .mbt {
          margin-bottom: 24px;
          :last-child {
            color: #ce2200;
          }
        }
        .g-btn {
          height: 64px;
          @include fcc;
          .n-cancel,
          .n-confirm {
            width: 96px;
            height: 40px;
            border-radius: 4px;
            border: 1px solid #e6e6e6;
            color: #000000a6;
            padding: 0;
          }
          .n-confirm {
            background: #0070f5;
            color: #ffffffd9;
            margin-left: 16px;
          }
          .m-err {
            border: 1px solid #ce2200;
            color: #ce2200;
          }
          .m-err:hover {
            background: #fff2e8;
          }
        }
      }
    }
  }
  .l-top {
    height: 64px;
    width: 100%;
    padding: 0 16px;
    box-sizing: border-box;
    @include fh;
    position: relative;
    font-size: 14px;
    .p-return {
      button {
        width: 72px;
        height: 32px;
        background: #e6f0ff;
        border-radius: 4px;
        color: #0070f5;
        padding: 0;
        border: 0;
      }
      i {
        font-size: 12px;
        margin-left: -6px;
      }
    }
    .p-msg {
      color: #000000d9;
      font-size: 14px;
      height: 64px;
      line-height: 64px;
      padding-left: 16px;
      position: relative;
      cursor: pointer;
      i {
        margin-right: 5px;
      }
      span {
        text-decoration: underline;
        font-weight: 530;
      }
      .g-dialog {
        width: 368px;
        height: 88px;
        background: white;
        position: absolute;
        margin-top: -1px;
        z-index: 12;
        padding: 0 4px;
        display: none;
        .g-row {
          height: 40px;
          display: flex;
          @include fh;
          padding: 0 16px;
          div {
            flex: 1;
            height: 100%;
            @include fh;
            display: flex;
            line-height: initial;
            width: 130px;
            span {
              color: #00000059;
              width: 70px;
              text-decoration: none;
            }
            i {
              margin-right: 5px;
              display: inline-block;
              flex: 1;
              font-style: normal;
              @include el;
            }
          }
          .w200 {
            width: 194px;
            @include el;
          }
          .w-time {
            :last-child {
              @include el;
              display: inline-block;
              width: 98px;
              color: #000000d9;
            }
          }
        }
      }
    }
    .p-msg:hover {
      .g-dialog {
        display: block;
      }
    }
    .p-center {
      position: absolute;
      height: 64px;
      line-height: 63px;
      right: 50%;
      text-align: right;
      cursor: pointer;
      .r-index {
        color: #0070f5;
      }
      .iconmenu-list {
        font-size: 12px;
      }
      .r-dialog {
        width: 312px;
        min-height: 200px;
        background: white;
        border-radius: 0 0 4px 4px;
        padding: 8px 0;
        box-sizing: border-box;
        position: relative;
        left: 50px;
        display: none;
        z-index: 22;
        .g-title {
          margin-bottom: 8px;
        }
        .g-title,
        .g-list {
          height: 40px;
          @include fh;
          padding: 0 16px;
        }
        .g-list {
          .t-1 {
            width: 80px;
            line-height: 40px;
            text-align: left;
            @include el;
          }
          .t-2 {
            width: 100px;
            line-height: 40px;
            color: #000000a6;
            text-align: center;
            @include el;
            .icondian {
              color: #ffa940;
            }
            .font3 {
              color: rgba(166, 166, 166, 1);
            }
            .font2 {
              color: rgba(0, 112, 245, 1);
              margin-left: -15px;
            }
          }
          .t-3 {
            flex: 1;
            text-align: left;
            line-height: 40px;
            color: #00000059;
            @include el;
          }
        }
        .g-active {
          background: #f5f7fa;
          color: #0070f5;
        }
      }
    }
    .p-center:hover {
      .r-dialog {
        display: block;
      }
    }
    .p-right {
      position: absolute;
      right: 16px;
      .t-save {
        border: 1px solid #bfdbfc;
        color: #0070f5;
      }
      .t-submit {
        background: #0070f5;
        border: 0;
        color: #ffffffd9;
      }
    }
    .p-right200 {
      position: absolute;
      right: 180px;
      .t16 {
        margin-right: 16px;
      }
    }
  }
  .l-bottom {
    height: 100%;
    width: 100%;
    display: flex;
    .m-right {
      width: 360px;
      height: 100%;
      border: 1px solid #e6e6e6;
      padding: 8px;
      font-size: 14px;
      padding-top: 0;
      box-sizing: border-box;
      .t-row1 {
        height: 48px;
        position: relative;
        @include fh;
        padding: 0 8px;
        border-bottom: 1px solid #e6e6e6;
        .w-title1 {
          font-weight: 550;
          color: #0070f5;
          margin-right: 16px;
        }
        .w-title2 {
          font-weight: 500;
          color: #d94f00;
          display: inline-block;
          height: 24px;
          background: #fff2e8;
          border-radius: 4px;
          line-height: 24px;
          padding: 0 5px;
        }
        .e-true {
          color: #000000a6;
          background: #e6e6e6;
        }
        i {
          position: absolute;
          right: 10px;
          cursor: pointer;
        }
      }

      .t-row5 {
        overflow: auto;
        height: calc(100% - 50px);
        .e-none {
          height: 100%;
          width: 100%;
          @include fcc;
          color: #000000d9;
        }
        .w-main {
          height: 40px;
          @include fh;
          padding: 0 8px;
          border-bottom: 1px solid #e6e6e6;
          position: relative;
          .n-left,
          .n-right {
            display: inline-block;
            flex: 0.5;
          }
          i {
            position: absolute;
            right: 10px;
            color: rgba(0, 0, 0, 0.35);
          }
          .n-left {
            width: 160px;
            .t-active {
              color: #e34242;
              height: 24px;
              background: #fff2e8;
              border-radius: 2px;
              padding: 0 5px;
              display: inline-block;
              line-height: 24px;
            }
            span {
              @include el;
              width: 100%;
              display: inline-block;
            }
          }
        }
      }
      .t-index {
        height: calc(100% - 256px);
        .t-row4 {
          height: 48px;
          position: relative;
          @include fh;
          padding: 0 8px;
          overflow: auto;
          .w-box,
          .el-input--mini {
            flex: 0.5;
          }
          .el-input--mini .el-input__inner {
            border: 0;
            border-radius: 0;
            background: #f5f7fa;
            box-shadow: 0 1px 0 0 #dedede;
          }
        }
      }
      .t-row3 {
        height: 48px;
        position: relative;
        @include fh;
        padding: 0 8px;
        border-bottom: 1px solid #e6e6e6;
        .mright16 {
          margin-right: 16px;
        }
        .w-title2 {
          font-weight: 500;
          color: #00000073;
          height: 49px;
          line-height: 55px;
          cursor: pointer;
        }
        .e-active {
          border-bottom: 1px solid #0070f5;
          margin-bottom: -1px;
          color: #0070f5;
          font-weight: 550;
        }
        .w-main {
          height: 49px;
          position: absolute;
          right: 10px;
          display: flex;
          align-items: center;
        }
        .w-back {
          background: #e6e6e6;
          width: 88px;
          height: 24px;
          @include fcc;
          color: #000000a6;
          position: relative;
          cursor: pointer;
          i {
            font-size: 14px;
            margin-right: 3px;
          }
          .k-return {
            width: 208px;
            background: white;
            z-index: 2;
            position: absolute;
            top: 30px;
            right: -1px;
          }
        }
        .w-main:hover {
          .k-return {
            display: block;
          }
        }
      }
      .t-row2 {
        .w-culome {
          height: 40px;
          @include fh;
          display: flex;
          padding: 0 8px;
          > div {
            flex: 1;
            display: flex;
            span {
              color: #00000059;
              width: 71px;
              display: inline-block;
            }
            .e-more {
              flex: 1;
            }
            .e-auto {
              @include el;
              color: #2c3e50;
            }
          }
          .e-other {
            @include el;
            width: 260px;
          }
        }
      }
    }
    .m-left {
      flex: 1;
      height: 100%;
      width: 100%;
      position: relative;
      .n-echarts {
        height: 156px;
        background: rgba(51, 51, 51, 1);
        width: 100%;
        #echarts {
          height: 100%;
          width: 100%;
        }
      }
      .t-main {
        padding: 0 16px;
        box-sizing: border-box;
        position: relative;
        .n-list {
          width: 322px;
          height: calc(100% - 2px);
          position: absolute;
          right: 0px;
          border: 1px solid #20a5d6;
          background: #000;
          z-index: 222;
        }
        .t-image {
          overflow: auto;
          height: 100%;
          .e-none {
            height: 100%;
            width: 100%;
            @include fcc;
            color: #888;
          }
          .e-card {
            width: 314px;
            height: 73px;
            border-bottom: 1px solid #333;
            padding: 0 8px;
            box-sizing: border-box;
            color: #9ccef9;
            .e-title {
              height: 40px;
              @include fh;
              display: flex;
              position: relative;
              .e-e {
                flex: 1;
                display: inline-block;
                @include el;
                font-weight: 550;
                .el-input--mini .el-input__inner {
                  border: 0;
                  width: 100%;
                  background: #000;
                  padding: 0 3px;
                  font-size: 14px;
                  font-weight: bold;
                  color: #9ccef9;
                  border-radius: 0;
                }
              }
              .e-icon {
                width: 30px;
                position: relative;
                height: 100%;
                line-height: 25px;
                margin-top: 46px;
                right: -16px;
                display: block;
                font-size: 18px;
                color: #9ccef9;
                cursor: pointer;
              }
              .e-icon:hover {
                .n-dialog {
                  display: block;
                }
              }
            }
            .e-result {
              width: 272px;
              color: #9ccef9;
              height: 28px;
              font-size: 14px;
              height: 28px;
              padding-left: 3px;
              line-height: 28px;
            }
          }
          .e-card:hover {
            cursor: pointer;
            .e-icon {
              display: block;
            }
          }
        }
        .n-progress {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          .n-value {
            position: absolute;
            right: 50%;
            margin-right: -128px;
            color: rgba(255, 255, 255, 0.65);
            font-size: 16px;
            top: 16px;
            .e-val {
              color: rgba(245, 247, 250, 1);
            }
          }
        }
        .n-image {
          display: flex;
          height: calc(100% - 199px);
          box-sizing: border-box;
          width: 100%;
          div {
            flex: 1;
            margin-right: 16px;
            border: 1px solid #2e2e2e;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .n-active {
            border: 1px solid #a10000;
          }
          .e-z {
            margin-right: 0;
          }
        }
        .n-xyz {
          height: 42px;
          @include fh;
          color: #9ccef9;
          span {
            display: inline-block;
            width: 70px;
          }
          :last-child {
            width: 125px;
          }
          .w90 {
            width: 90px;
          }
        }
      }
      .t-tools-dis {
        position: absolute;
        height: 56px;
        z-index: 22;
        width: 100%;
        cursor: not-allowed;
        background: #988e8e;
        opacity: 0.3;
      }
      .t-tools {
        height: 56px;
        width: 100%;
        background: black;
        @include fh;
        padding-left: 252px;
        box-sizing: border-box;
        position: relative;
        color: #9ccef9;
        .s-box {
          position: absolute;
          right: 16px;
          cursor: pointer;
          i {
            font-size: 18px;
          }
        }
        .s-percent {
          position: absolute;
          right: 66px;
          font-size: 18px;
          color: #a91414;
        }
        .s-title {
          position: absolute;
          left: 16px;
          font-size: 21px;
          @include fh;
          i {
            font-size: 40px;
            margin-right: 6px;
          }
          .e-upload {
            @include fh;
          }
        }
        .s-volume {
          margin-right: 10px;
          .el-input-number--small {
            width: 80px;
          }
          .el-input__inner {
            padding-left: 8px;
            padding-right: 42px;
            background: #000;
            color: #9ccef9;
            border: 1px solid #9ccef9;
          }
          .e-span {
            margin-right: 5px;
          }
          .el-input-number__decrease,
          .el-input-number__increase {
            background: #000;
            color: #9ccef9;
            border-left: 1px solid #9ccef9;
          }
          .el-input-number__increase {
            border-bottom: 1px solid #9ccef9;
          }
        }
        .s-other {
          width: 48px;
          text-align: center;
          cursor: pointer;
          position: relative;
          height: 56px;
          line-height: 56px;
          i {
            font-size: 21px;
          }
          .r-tools {
            position: absolute;
            width: 90px;
            background: #222;
            top: 55px;
            right: -21px;
            padding: 4px 0;
            box-sizing: border-box;
            display: none;
            z-index: 22;
            div {
              height: 32px;
              @include fcc;
              color: #9ccef9;
              span {
                font-size: 14px;
                height: 32px;
                line-height: 32px;
              }
              i {
                height: 32px;
                line-height: 32px;
                font-size: 12px;
                margin-right: 5px;
              }
            }
            div:hover {
              color: #0070f5;
              i {
                color: #0070f5;
              }
            }
            .s-select {
              background: #444;
              color: #0070f5;
              i {
                color: #0070f5;
              }
            }
          }
        }
        .t-dialog3 {
          .r-tools {
            width: 71px;
            right: -11px;
          }
        }
        .s-other:hover {
          .t-active {
            color: #ce2200;
            font-size: 22px;
          }
        }
        .s-select {
          .t-active {
            color: #0070f5;
            font-size: 22px;
          }
        }
        .t-dialog1:hover {
          .r-tools {
            display: block;
          }
        }
        .t-dialog2:hover {
          .r-tools {
            display: block;
          }
        }
        .t-dialog2 {
          i {
            width: 16px;
            height: 12px;
            display: inline-block;
          }
          .s-color {
            padding: 0 8px;
            justify-content: left !important;
            i {
              height: 12px !important;
            }
            span {
              @include el;
              width: 53px;
              justify-content: left;
              text-align: left;
            }
          }
          .color-barautumn {
            background: linear-gradient(
              90deg,
              rgba(254, 0, 0, 1) 0%,
              rgba(255, 171, 60, 1) 100%
            );
          }
          .color-barblues {
            background: linear-gradient(
              90deg,
              rgba(95, 180, 231, 1) 0%,
              rgba(203, 234, 255, 1) 100%
            );
          }
          .color-barbone {
            background: linear-gradient(
              90deg,
              rgba(52, 52, 112, 1) 0%,
              rgba(93, 103, 135, 1) 100%
            );
          }
          .color-barcool {
            background: linear-gradient(
              90deg,
              rgba(148, 106, 254, 1) 0%,
              rgba(8, 250, 254, 1) 100%
            );
          }
          .color-barcoolwarm {
            background: linear-gradient(
              90deg,
              rgba(56, 76, 200, 1) 0%,
              rgba(255, 210, 188, 1) 62%,
              rgba(196, 216, 255, 1) 100%
            );
          }
          .color-barcopper {
            background: linear-gradient(
              90deg,
              rgba(100, 57, 30, 1) 0%,
              rgba(171, 108, 69, 1) 100%
            );
          }
          .color-bargray {
            background: linear-gradient(
              90deg,
              rgba(45, 45, 45, 1) 0%,
              rgba(127, 127, 127, 1) 100%
            );
          }
          .color-barhot {
            background: linear-gradient(
              90deg,
              rgba(236, 2, 0, 1) 0%,
              rgba(72, 0, 0, 1) 100%
            );
          }
          .color-barhotIron {
            background: linear-gradient(
              90deg,
              rgba(163, 0, 1, 1) 0%,
              rgba(118, 0, 0, 1) 100%
            );
          }
          .color-barhotMetalBlue {
            background: linear-gradient(
              90deg,
              rgba(0, 16, 136, 1) 0%,
              rgba(207, 61, 0, 1) 100%
            );
          }
          .color-barhsv {
            background: linear-gradient(
              90deg,
              rgba(253, 16, 1, 1) 0%,
              rgba(86, 232, 46, 1) 53%,
              rgba(255, 215, 22, 1) 100%
            );
          }
          .color-barjet {
            background: linear-gradient(
              90deg,
              rgba(4, 0, 174, 1) 0%,
              rgba(63, 246, 160, 1) 56%,
              rgba(247, 246, 0, 1) 100%
            );
          }
          .color-barpet {
            background: linear-gradient(
              90deg,
              rgba(0, 108, 105, 1) 0%,
              rgba(28, 79, 169, 1) 56%,
              rgba(191, 44, 202, 1) 100%
            );
          }
          .color-barpet20Step {
            background: linear-gradient(
              90deg,
              rgba(99, 0, 83, 1) 0%,
              rgba(78, 79, 176, 1) 56%,
              rgba(78, 187, 79, 1) 100%
            );
          }
          .color-barspectral {
            background: linear-gradient(
              90deg,
              rgba(107, 0, 129, 1) 0%,
              rgba(6, 12, 214, 1) 49%,
              rgba(0, 205, 10, 1) 100%
            );
          }
          .color-barspring {
            background: linear-gradient(
              90deg,
              rgba(254, 9, 248, 1) 0%,
              rgba(253, 164, 91, 1) 100%
            );
          }
          .color-barsummer {
            background: linear-gradient(
              90deg,
              rgba(0, 128, 102, 1) 0%,
              rgba(151, 203, 102, 1) 100%
            );
          }
          .color-barwinter {
            background: linear-gradient(
              90deg,
              rgba(12, 2, 254, 1) 0%,
              rgba(2, 167, 172, 1) 100%
            );
          }
        }
        .t-dialog3:hover {
          .r-tools {
            display: block;
          }
        }
      }
      .t-main {
        height: calc(100% - 56px);
        width: 100%;
        background: black;
      }
    }
  }
}
</style>
