<template>
  <div class="z_time_pick" :class="size">

    <!-- <el-popover placement="bottom" title="标题" width="200" trigger="click" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
      <el-button slot="reference">click 激活</el-button>
    </el-popover> -->
    <el-input :placeholder="startPlaceholder" style="width: 48%;"></el-input>
    <span>{{ rangeSeparator }}</span>
    <el-input :placeholder="endPlaceholder" style="width: 48%;"></el-input>
  </div>

  <!--  <div class="el-time-range-picker el-picker-panel el-popper"
    style="transform-origin: center top; z-index: 2013; position: fixed; top: 315px; left: 552px;"
    x-placement="bottom-start">
    <div class="el-time-range-picker__content">
      <div class="el-time-range-picker__cell">
        <div class="el-time-range-picker__header">开始时间</div>
        <div class="el-time-range-picker__body el-time-panel__content has-seconds">
          <div class="el-time-spinner has-seconds">
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item">00</li>
                  <li class="el-time-spinner__item">01</li>
                  <li class="el-time-spinner__item">02</li>
                  <li class="el-time-spinner__item">03</li>
                  <li class="el-time-spinner__item">04</li>
                  <li class="el-time-spinner__item">05</li>
                  <li class="el-time-spinner__item">06</li>
                  <li class="el-time-spinner__item">07</li>
                  <li class="el-time-spinner__item">08</li>
                  <li class="el-time-spinner__item">09</li>
                  <li class="el-time-spinner__item">10</li>
                  <li class="el-time-spinner__item">11</li>
                  <li class="el-time-spinner__item">12</li>
                  <li class="el-time-spinner__item disabled">13</li>
                  <li class="el-time-spinner__item disabled">14</li>
                  <li class="el-time-spinner__item disabled">15</li>
                  <li class="el-time-spinner__item disabled">16</li>
                  <li class="el-time-spinner__item disabled">17</li>
                  <li class="el-time-spinner__item disabled">18</li>
                  <li class="el-time-spinner__item disabled">19</li>
                  <li class="el-time-spinner__item disabled">20</li>
                  <li class="el-time-spinner__item disabled">21</li>
                  <li class="el-time-spinner__item disabled">22</li>
                  <li class="el-time-spinner__item active">23</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 20.3606%; transform: translateY(383.333%);"></div>
              </div>
            </div>
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item disabled">00</li>
                  <li class="el-time-spinner__item disabled">01</li>
                  <li class="el-time-spinner__item disabled">02</li>
                  <li class="el-time-spinner__item disabled">03</li>
                  <li class="el-time-spinner__item disabled">04</li>
                  <li class="el-time-spinner__item disabled">05</li>
                  <li class="el-time-spinner__item disabled">06</li>
                  <li class="el-time-spinner__item disabled">07</li>
                  <li class="el-time-spinner__item disabled">08</li>
                  <li class="el-time-spinner__item disabled">09</li>
                  <li class="el-time-spinner__item disabled">10</li>
                  <li class="el-time-spinner__item disabled">11</li>
                  <li class="el-time-spinner__item disabled">12</li>
                  <li class="el-time-spinner__item disabled">13</li>
                  <li class="el-time-spinner__item disabled">14</li>
                  <li class="el-time-spinner__item disabled">15</li>
                  <li class="el-time-spinner__item disabled">16</li>
                  <li class="el-time-spinner__item disabled">17</li>
                  <li class="el-time-spinner__item disabled">18</li>
                  <li class="el-time-spinner__item disabled">19</li>
                  <li class="el-time-spinner__item disabled">20</li>
                  <li class="el-time-spinner__item disabled">21</li>
                  <li class="el-time-spinner__item disabled">22</li>
                  <li class="el-time-spinner__item disabled">23</li>
                  <li class="el-time-spinner__item disabled">24</li>
                  <li class="el-time-spinner__item disabled">25</li>
                  <li class="el-time-spinner__item disabled">26</li>
                  <li class="el-time-spinner__item disabled">27</li>
                  <li class="el-time-spinner__item disabled">28</li>
                  <li class="el-time-spinner__item disabled">29</li>
                  <li class="el-time-spinner__item disabled">30</li>
                  <li class="el-time-spinner__item disabled">31</li>
                  <li class="el-time-spinner__item disabled">32</li>
                  <li class="el-time-spinner__item disabled">33</li>
                  <li class="el-time-spinner__item disabled">34</li>
                  <li class="el-time-spinner__item disabled">35</li>
                  <li class="el-time-spinner__item disabled">36</li>
                  <li class="el-time-spinner__item disabled">37</li>
                  <li class="el-time-spinner__item disabled">38</li>
                  <li class="el-time-spinner__item disabled">39</li>
                  <li class="el-time-spinner__item disabled">40</li>
                  <li class="el-time-spinner__item disabled">41</li>
                  <li class="el-time-spinner__item disabled">42</li>
                  <li class="el-time-spinner__item disabled">43</li>
                  <li class="el-time-spinner__item disabled">44</li>
                  <li class="el-time-spinner__item disabled">45</li>
                  <li class="el-time-spinner__item disabled">46</li>
                  <li class="el-time-spinner__item disabled">47</li>
                  <li class="el-time-spinner__item disabled">48</li>
                  <li class="el-time-spinner__item disabled">49</li>
                  <li class="el-time-spinner__item disabled">50</li>
                  <li class="el-time-spinner__item disabled">51</li>
                  <li class="el-time-spinner__item disabled">52</li>
                  <li class="el-time-spinner__item disabled">53</li>
                  <li class="el-time-spinner__item disabled">54</li>
                  <li class="el-time-spinner__item disabled">55</li>
                  <li class="el-time-spinner__item disabled">56</li>
                  <li class="el-time-spinner__item disabled">57</li>
                  <li class="el-time-spinner__item disabled">58</li>
                  <li class="el-time-spinner__item active">59</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 9.16468%; transform: translateY(983.333%);"></div>
              </div>
            </div>
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item">00</li>
                  <li class="el-time-spinner__item">01</li>
                  <li class="el-time-spinner__item">02</li>
                  <li class="el-time-spinner__item">03</li>
                  <li class="el-time-spinner__item">04</li>
                  <li class="el-time-spinner__item">05</li>
                  <li class="el-time-spinner__item">06</li>
                  <li class="el-time-spinner__item">07</li>
                  <li class="el-time-spinner__item">08</li>
                  <li class="el-time-spinner__item">09</li>
                  <li class="el-time-spinner__item">10</li>
                  <li class="el-time-spinner__item">11</li>
                  <li class="el-time-spinner__item">12</li>
                  <li class="el-time-spinner__item">13</li>
                  <li class="el-time-spinner__item">14</li>
                  <li class="el-time-spinner__item">15</li>
                  <li class="el-time-spinner__item">16</li>
                  <li class="el-time-spinner__item">17</li>
                  <li class="el-time-spinner__item">18</li>
                  <li class="el-time-spinner__item">19</li>
                  <li class="el-time-spinner__item">20</li>
                  <li class="el-time-spinner__item">21</li>
                  <li class="el-time-spinner__item">22</li>
                  <li class="el-time-spinner__item">23</li>
                  <li class="el-time-spinner__item">24</li>
                  <li class="el-time-spinner__item">25</li>
                  <li class="el-time-spinner__item">26</li>
                  <li class="el-time-spinner__item">27</li>
                  <li class="el-time-spinner__item">28</li>
                  <li class="el-time-spinner__item">29</li>
                  <li class="el-time-spinner__item">30</li>
                  <li class="el-time-spinner__item">31</li>
                  <li class="el-time-spinner__item">32</li>
                  <li class="el-time-spinner__item">33</li>
                  <li class="el-time-spinner__item">34</li>
                  <li class="el-time-spinner__item">35</li>
                  <li class="el-time-spinner__item">36</li>
                  <li class="el-time-spinner__item">37</li>
                  <li class="el-time-spinner__item">38</li>
                  <li class="el-time-spinner__item">39</li>
                  <li class="el-time-spinner__item">40</li>
                  <li class="el-time-spinner__item">41</li>
                  <li class="el-time-spinner__item">42</li>
                  <li class="el-time-spinner__item">43</li>
                  <li class="el-time-spinner__item">44</li>
                  <li class="el-time-spinner__item">45</li>
                  <li class="el-time-spinner__item">46</li>
                  <li class="el-time-spinner__item">47</li>
                  <li class="el-time-spinner__item">48</li>
                  <li class="el-time-spinner__item">49</li>
                  <li class="el-time-spinner__item">50</li>
                  <li class="el-time-spinner__item">51</li>
                  <li class="el-time-spinner__item">52</li>
                  <li class="el-time-spinner__item">53</li>
                  <li class="el-time-spinner__item">54</li>
                  <li class="el-time-spinner__item">55</li>
                  <li class="el-time-spinner__item">56</li>
                  <li class="el-time-spinner__item">57</li>
                  <li class="el-time-spinner__item">58</li>
                  <li class="el-time-spinner__item active">59</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 9.16468%; transform: translateY(983.333%);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-time-range-picker__cell">
        <div class="el-time-range-picker__header">结束时间</div>
        <div class="el-time-range-picker__body el-time-panel__content has-seconds">
          <div class="el-time-spinner has-seconds">
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item disabled">00</li>
                  <li class="el-time-spinner__item disabled">01</li>
                  <li class="el-time-spinner__item disabled">02</li>
                  <li class="el-time-spinner__item disabled">03</li>
                  <li class="el-time-spinner__item disabled">04</li>
                  <li class="el-time-spinner__item disabled">05</li>
                  <li class="el-time-spinner__item disabled">06</li>
                  <li class="el-time-spinner__item disabled">07</li>
                  <li class="el-time-spinner__item disabled">08</li>
                  <li class="el-time-spinner__item disabled">09</li>
                  <li class="el-time-spinner__item disabled">10</li>
                  <li class="el-time-spinner__item disabled">11</li>
                  <li class="el-time-spinner__item">12</li>
                  <li class="el-time-spinner__item">13</li>
                  <li class="el-time-spinner__item">14</li>
                  <li class="el-time-spinner__item">15</li>
                  <li class="el-time-spinner__item">16</li>
                  <li class="el-time-spinner__item">17</li>
                  <li class="el-time-spinner__item">18</li>
                  <li class="el-time-spinner__item">19</li>
                  <li class="el-time-spinner__item">20</li>
                  <li class="el-time-spinner__item">21</li>
                  <li class="el-time-spinner__item">22</li>
                  <li class="el-time-spinner__item active">23</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 20.3606%; transform: translateY(383.333%);"></div>
              </div>
            </div>
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item">00</li>
                  <li class="el-time-spinner__item">01</li>
                  <li class="el-time-spinner__item">02</li>
                  <li class="el-time-spinner__item">03</li>
                  <li class="el-time-spinner__item">04</li>
                  <li class="el-time-spinner__item">05</li>
                  <li class="el-time-spinner__item">06</li>
                  <li class="el-time-spinner__item">07</li>
                  <li class="el-time-spinner__item">08</li>
                  <li class="el-time-spinner__item">09</li>
                  <li class="el-time-spinner__item">10</li>
                  <li class="el-time-spinner__item">11</li>
                  <li class="el-time-spinner__item">12</li>
                  <li class="el-time-spinner__item">13</li>
                  <li class="el-time-spinner__item">14</li>
                  <li class="el-time-spinner__item">15</li>
                  <li class="el-time-spinner__item">16</li>
                  <li class="el-time-spinner__item">17</li>
                  <li class="el-time-spinner__item">18</li>
                  <li class="el-time-spinner__item">19</li>
                  <li class="el-time-spinner__item">20</li>
                  <li class="el-time-spinner__item">21</li>
                  <li class="el-time-spinner__item">22</li>
                  <li class="el-time-spinner__item">23</li>
                  <li class="el-time-spinner__item">24</li>
                  <li class="el-time-spinner__item">25</li>
                  <li class="el-time-spinner__item">26</li>
                  <li class="el-time-spinner__item">27</li>
                  <li class="el-time-spinner__item">28</li>
                  <li class="el-time-spinner__item">29</li>
                  <li class="el-time-spinner__item">30</li>
                  <li class="el-time-spinner__item">31</li>
                  <li class="el-time-spinner__item">32</li>
                  <li class="el-time-spinner__item">33</li>
                  <li class="el-time-spinner__item">34</li>
                  <li class="el-time-spinner__item">35</li>
                  <li class="el-time-spinner__item">36</li>
                  <li class="el-time-spinner__item">37</li>
                  <li class="el-time-spinner__item">38</li>
                  <li class="el-time-spinner__item">39</li>
                  <li class="el-time-spinner__item">40</li>
                  <li class="el-time-spinner__item">41</li>
                  <li class="el-time-spinner__item">42</li>
                  <li class="el-time-spinner__item">43</li>
                  <li class="el-time-spinner__item">44</li>
                  <li class="el-time-spinner__item">45</li>
                  <li class="el-time-spinner__item">46</li>
                  <li class="el-time-spinner__item">47</li>
                  <li class="el-time-spinner__item">48</li>
                  <li class="el-time-spinner__item">49</li>
                  <li class="el-time-spinner__item">50</li>
                  <li class="el-time-spinner__item">51</li>
                  <li class="el-time-spinner__item">52</li>
                  <li class="el-time-spinner__item">53</li>
                  <li class="el-time-spinner__item">54</li>
                  <li class="el-time-spinner__item">55</li>
                  <li class="el-time-spinner__item">56</li>
                  <li class="el-time-spinner__item">57</li>
                  <li class="el-time-spinner__item">58</li>
                  <li class="el-time-spinner__item active">59</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 9.16468%; transform: translateY(983.333%);"></div>
              </div>
            </div>
            <div class="el-time-spinner__wrapper el-scrollbar">
              <div class="el-scrollbar__wrap" style="max-height: inherit; margin-bottom: -13px; margin-right: -13px;">
                <ul class="el-scrollbar__view el-time-spinner__list">
                  <li class="el-time-spinner__item">00</li>
                  <li class="el-time-spinner__item">01</li>
                  <li class="el-time-spinner__item">02</li>
                  <li class="el-time-spinner__item">03</li>
                  <li class="el-time-spinner__item">04</li>
                  <li class="el-time-spinner__item">05</li>
                  <li class="el-time-spinner__item">06</li>
                  <li class="el-time-spinner__item">07</li>
                  <li class="el-time-spinner__item">08</li>
                  <li class="el-time-spinner__item">09</li>
                  <li class="el-time-spinner__item">10</li>
                  <li class="el-time-spinner__item">11</li>
                  <li class="el-time-spinner__item">12</li>
                  <li class="el-time-spinner__item">13</li>
                  <li class="el-time-spinner__item">14</li>
                  <li class="el-time-spinner__item">15</li>
                  <li class="el-time-spinner__item">16</li>
                  <li class="el-time-spinner__item">17</li>
                  <li class="el-time-spinner__item">18</li>
                  <li class="el-time-spinner__item">19</li>
                  <li class="el-time-spinner__item">20</li>
                  <li class="el-time-spinner__item">21</li>
                  <li class="el-time-spinner__item">22</li>
                  <li class="el-time-spinner__item">23</li>
                  <li class="el-time-spinner__item">24</li>
                  <li class="el-time-spinner__item">25</li>
                  <li class="el-time-spinner__item">26</li>
                  <li class="el-time-spinner__item">27</li>
                  <li class="el-time-spinner__item">28</li>
                  <li class="el-time-spinner__item">29</li>
                  <li class="el-time-spinner__item">30</li>
                  <li class="el-time-spinner__item">31</li>
                  <li class="el-time-spinner__item">32</li>
                  <li class="el-time-spinner__item">33</li>
                  <li class="el-time-spinner__item">34</li>
                  <li class="el-time-spinner__item">35</li>
                  <li class="el-time-spinner__item">36</li>
                  <li class="el-time-spinner__item">37</li>
                  <li class="el-time-spinner__item">38</li>
                  <li class="el-time-spinner__item">39</li>
                  <li class="el-time-spinner__item">40</li>
                  <li class="el-time-spinner__item">41</li>
                  <li class="el-time-spinner__item">42</li>
                  <li class="el-time-spinner__item">43</li>
                  <li class="el-time-spinner__item">44</li>
                  <li class="el-time-spinner__item">45</li>
                  <li class="el-time-spinner__item">46</li>
                  <li class="el-time-spinner__item">47</li>
                  <li class="el-time-spinner__item">48</li>
                  <li class="el-time-spinner__item">49</li>
                  <li class="el-time-spinner__item">50</li>
                  <li class="el-time-spinner__item">51</li>
                  <li class="el-time-spinner__item">52</li>
                  <li class="el-time-spinner__item">53</li>
                  <li class="el-time-spinner__item">54</li>
                  <li class="el-time-spinner__item">55</li>
                  <li class="el-time-spinner__item">56</li>
                  <li class="el-time-spinner__item">57</li>
                  <li class="el-time-spinner__item">58</li>
                  <li class="el-time-spinner__item active">59</li>
                </ul>
              </div>
              <div class="el-scrollbar__bar is-horizontal">
                <div class="el-scrollbar__thumb" style="transform: translateX(0%);"></div>
              </div>
              <div class="el-scrollbar__bar is-vertical">
                <div class="el-scrollbar__thumb" style="height: 9.16468%; transform: translateY(983.333%);"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="el-time-panel__footer"><button type="button" class="el-time-panel__btn cancel">取消</button><button
        type="button" class="el-time-panel__btn confirm">确定</button></div>
    <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
  </div> -->

</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    },
    rangeSeparator: {
      type: String,
      default: '-'
    },
    startPlaceholder: {
      type: String,
      default: 'start'
    },
    endPlaceholder: {
      type: String,
      default: 'end'
    }
  },
  data() {
    return {
      options: [
        '00',
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31',
        '32',
        '33',
        '34',
        '35',
        '36',
        '37',
        '38',
        '39',
        '40',
        '41',
        '42',
        '43',
        '44',
        '45',
        '46',
        '47',
        '48',
        '49',
        '50',
        '51',
        '52',
        '53',
        '54',
        '55',
        '56',
        '57',
        '58',
        '59'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.z_time_pick {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  text-align: center;

  &:hover {
    border-color: #c0c4cc;
  }

  &:focus {
    border-color: var(--themeColor, $base-color-default);
  }
}

.medium {
  height: 36px;
}

.small {
  height: 32px;
}

.mini {
  height: 28px;
}

::v-deep {
  .el-input__inner {
    border-color: transparent;
  }
}
</style>
