(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const I18N = {
    vi: {
      settingsEyebrow: 'GIAO DIỆN KHỞI ĐỘNG',
      settingsTitle: 'Tùy chỉnh giao diện theo ý bạn',
      settingsDescription: 'Tùy chỉnh 2 hình ảnh và văn bản bên dưới, để trống để ẩn chữ.',
      avatarTitle: 'Ảnh đại diện (Nửa đầu)',
      avatarTip: 'Ảnh vuông cho hiệu quả tốt nhất',
      avatarChange: 'Đổi ảnh đại diện',
      bgTitle: 'Hình nền (Nửa sau)',
      bgTip: 'Nên dùng ảnh ngang 3:2 · Tự tạo nét vẽ vector',
      bgChange: 'Đổi hình nền',
      introTitleLabel: 'Nửa đầu · Tiêu đề dưới ảnh đại diện',
      introTitleLimit: 'Tối đa 16 ký tự',
      introCaptionLabel: 'Nửa đầu · Dòng phụ dưới tiêu đề',
      introCaptionLimit: 'Tối đa 48 ký tự',
      artworkSubtitleLabel: 'Nửa sau · Phụ đề dưới hình nền',
      artworkSubtitleLimit: 'Tối đa 60 ký tự',
      wallpaperStrengthLabel: 'Độ hiển thị hình nền Codex',
      wallpaperStrengthTip: 'Sau khi khởi động xong, hình nền tiếp tục phủ cửa sổ. 0% là tắt hình nền.',
      statusDefault: 'Hình ảnh và chữ lưu trên máy. Bấm "Lưu & Xem trước" để áp dụng; đóng để hủy thay đổi.',
      statusPreparingAvatar: 'Đang chuẩn bị ảnh đại diện...',
      statusGeneratingContours: 'Đang tự động vẽ đường nét vector cho hình nền mới...',
      statusImageReady: 'Hình ảnh đã sẵn sàng, bấm "Lưu & Xem trước" để áp dụng.',
      statusSaving: 'Đang lưu...',
      statusSaveFailed: 'Lưu thất bại, đã giữ nguyên cài đặt cũ: ',
      statusResetDone: 'Đã khôi phục mặc định ảnh, chữ và độ mờ. Bấm "Lưu & Xem trước" để áp dụng.',
      btnReset: 'Khôi phục mặc định',
      btnSavePreview: 'Lưu & Xem trước',
      btnRestoreAppearance: 'Tắt giao diện, khôi phục gốc Codex',
      closeAria: 'Đóng cài đặt',
      btnSettings: 'Cài đặt giao diện',
      btnSkip: 'NHẤN / ESC ĐỂ BỎ QUA',
      skipTitle: 'Bỏ qua hoạt ảnh (Esc)',
      assetError: 'Tải tài nguyên hoạt ảnh thất bại, vui lòng kiểm tra thư mục assets.',
      endEyebrow: 'KẾT NỐI ĐÃ THIẾT LẬP',
      endTitle: 'Linh hồn, đã ở bên cạnh bạn.',
      endDesc: 'Hoạt ảnh mở màn 12 giây đã kết thúc',
      descLaunchingCodex: 'Đang hiển thị Codex…',
      descSkipped: 'Đã bỏ qua hoạt ảnh',
      btnEnded: 'Đã kết thúc',
      btnReplayEnd: 'Xem lại lần nữa',
      btnReplay: 'Xem lại',
      btnPause: 'Tạm dừng',
      btnPlay: 'Tiếp tục',
      nativeLaunch: 'Khởi chạy Codex ↗',
      previewNote: '12 giây · Có thể bỏ qua bất kỳ lúc nào',
      previewNoteProgress: 'Phần trăm là tiến trình hoạt ảnh',
      defaultIntroTitle: 'Phi Hành Tuyết Nhung',
      defaultIntroCaption: 'CODEX INITIALIZE / TYPE-0',
      defaultArtworkSubtitle: 'Linh hồn đã đến... bên cạnh bạn~'
    },
    en: {
      settingsEyebrow: 'YOUR STARTUP',
      settingsTitle: 'Customize Your Startup Screen',
      settingsDescription: 'Customize the two images and text below. Leave blank to hide text.',
      avatarTitle: 'Avatar (First Half)',
      avatarTip: 'Square images work best',
      avatarChange: 'Change Avatar',
      bgTitle: 'Background (Second Half)',
      bgTip: '3:2 landscape recommended · Auto line art',
      bgChange: 'Change Background',
      introTitleLabel: 'First Half · Title below Avatar',
      introTitleLimit: 'Max 16 characters',
      introCaptionLabel: 'First Half · Caption below Title',
      introCaptionLimit: 'Max 48 characters',
      artworkSubtitleLabel: 'Second Half · Subtitle below Background',
      artworkSubtitleLimit: 'Max 60 characters',
      wallpaperStrengthLabel: 'Codex Background Opacity',
      wallpaperStrengthTip: 'Background remains after startup. 0% disables background.',
      statusDefault: 'Saved locally. Click "Save & Preview" to apply; close to discard.',
      statusPreparingAvatar: 'Preparing avatar image...',
      statusGeneratingContours: 'Generating vector contour lines for new background...',
      statusImageReady: 'Images ready, click "Save & Preview" to apply.',
      statusSaving: 'Saving...',
      statusSaveFailed: 'Save failed, previous settings retained: ',
      statusResetDone: 'Reset to default images, texts, and opacity. Click "Save & Preview" to apply.',
      btnReset: 'Restore Defaults',
      btnSavePreview: 'Save & Preview',
      btnRestoreAppearance: 'Disable Theme, Restore Codex Default',
      closeAria: 'Close Settings',
      btnSettings: 'Settings',
      btnSkip: 'CLICK / ESC TO SKIP',
      skipTitle: 'Skip Animation (Esc)',
      assetError: 'Failed to load assets. Please ensure assets folder is complete.',
      endEyebrow: 'CONNECTION ESTABLISHED',
      endTitle: 'A wandering spirit... by your side.',
      endDesc: '12-second startup preview completed',
      descLaunchingCodex: 'Opening Codex…',
      descSkipped: 'Animation skipped',
      btnEnded: 'Ended',
      btnReplayEnd: 'Replay once more',
      btnReplay: 'Replay',
      btnPause: 'Pause',
      btnPlay: 'Play',
      nativeLaunch: 'Launch Codex ↗',
      previewNote: '12 seconds · Skip anytime with Esc',
      previewNoteProgress: 'Percentage indicates animation progress',
      defaultIntroTitle: 'Flying Fluff',
      defaultIntroCaption: 'CODEX INITIALIZE / TYPE-0',
      defaultArtworkSubtitle: 'A wandering spirit... by your side~'
    },
    zh: {
      settingsEyebrow: 'YOUR STARTUP',
      settingsTitle: '换成你喜欢的画面',
      settingsDescription: '自定义两张图片和下方文字，留空可隐藏对应文字。',
      avatarTitle: '前半段头像',
      avatarTip: '方形图片效果最好',
      avatarChange: '更换头像',
      bgTitle: '后半段背景',
      bgTip: '推荐 3:2 横图 · 自动生成线稿',
      bgChange: '更换背景',
      introTitleLabel: '前半段 · 头像下方标题',
      introTitleLimit: '最多 16 字',
      introCaptionLabel: '前半段 · 标题下方小字',
      introCaptionLimit: '最多 48 字',
      artworkSubtitleLabel: '后半段 · 背景下方字幕',
      artworkSubtitleLimit: '最多 60 字',
      wallpaperStrengthLabel: 'Codex 背景显现程度',
      wallpaperStrengthTip: '启动结束后，背景继续铺满窗口。0% 为不显示背景。',
      statusDefault: '图片与文字保存在本机。修改后点击「保存并预览」；关闭则放弃本次修改。',
      statusPreparingAvatar: '正在准备头像…',
      statusGeneratingContours: '正在为新背景生成线稿…',
      statusImageReady: '图片已准备好，点击「保存并预览」应用。',
      statusSaving: '正在保存…',
      statusSaveFailed: '保存失败，原设置已保留：',
      statusResetDone: '已选用默认图片、文字和背景显现程度，点击「保存并预览」应用。',
      btnReset: '恢复默认图片与文字',
      btnSavePreview: '保存并预览',
      btnRestoreAppearance: '关闭美化，恢复 Codex 外观',
      closeAria: '关闭图片设置',
      btnSettings: '图片设置',
      btnSkip: 'CLICK / ESC TO SKIP',
      skipTitle: '跳过动画（Esc）',
      assetError: '动画素材加载失败，请确认 assets 文件夹完整。',
      endEyebrow: 'CONNECTION ESTABLISHED',
      endTitle: '幽灵，已在你身边。',
      endDesc: '12 秒开场预览结束',
      descLaunchingCodex: '正在显示 Codex…',
      descSkipped: '已跳过开场动画',
      btnEnded: '已结束',
      btnReplayEnd: '再看一次',
      btnReplay: '重播',
      btnPause: '暂停',
      btnPlay: '继续',
      nativeLaunch: '播放并打开 Codex ↗',
      previewNote: '12 秒 · 可随时跳过',
      previewNoteProgress: '画面百分比为动画进度',
      defaultIntroTitle: '飞行雪绒',
      defaultIntroCaption: 'CODEX INITIALIZE / TYPE-0',
      defaultArtworkSubtitle: '幽灵来到…你身边～'
    }
  };
  let currentLang = (function(){
    try {
      const s = localStorage.getItem('aemeath-lang');
      if (s && I18N[s]) return s;
    } catch {}
    return 'vi';
  })();
  const t = key => (I18N[currentLang]?.[key] !== undefined ? I18N[currentLang][key] : (I18N['vi'][key] || ''));
  const duration = 12000;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const native = !window.AEMEATH_EXTERNAL && Boolean(window.webkit?.messageHandlers?.launcher);
  const embedded = window.parent!==window && (window.AEMEATH_EXTERNAL || new URLSearchParams(location.search).has('embedded'));
  const assets=window.AEMEATH_ASSETS||{artwork:'assets/artwork.jpg',avatar:'assets/avatar.jpg'};
  if(embedded)document.body.classList.add('embedded');
  const root = $('.window'), art = $('.artwork'), scene = $('.scene');
  const hud = $('.hud'), intro = $('.intro'), sweep = $('.light-sweep');
  const slider = $('#timeline'), pause = $('#pause'), subtitle = $('.subtitle');
  slider.max=String(duration/1000);
  let playing = false, elapsed = 0, origin = 0, frame = 0, lastUI = -Infinity;
  let completed = false, hiddenPause = false, mode = 'preview', loaded = false, revealed = false;
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { const t = clamp(n); return t*t*(3-2*t); };
  const send = (action, details={}) => {
    if(native)window.webkit.messageHandlers.launcher.postMessage(action);
    if(embedded){const data={type:'aemeath-boot',action,...details};if(window.AEMEATH_EXTERNAL)window.AEMEATH_SEND(data);else window.parent.postMessage(data,'*');}
  };
  const particles = Array.from({length: reduced ? 0 : 14}, (_, i) => {
    const node = document.createElement('i'); node.className = 'particle';
    const size = i % 4 === 0 ? 3 : 1.5;
    Object.assign(node.style, {width:`${size}px`,height:`${size}px`,left:`${(i*37+7)%100}%`,top:`${(i*23+17)%100}%`});
    $('.particles').appendChild(node); return node;
  });
  const milestones = [[0,0],[.12,.06],[.35,.41],[.56,.76],[.66,.924],[.72,.97],[.77,1],[1,1]];
  function progress(t) {
    const p = t / duration;
    for (let i=1;i<milestones.length;i++) {
      if (p <= milestones[i][0]) {
        const [a,x] = milestones[i-1], [b,y] = milestones[i];
        return x+(y-x)*smooth((p-a)/(b-a));
      }
    }
    return 1;
  }
  // Cached DOM elements for render loop to avoid per-frame queries
  const elTransitionFlash = $('.transition-flash');
  const elShutterLine = $('.shutter-line');
  const elIdentity = $('.identity');
  const elAvatarFrame = $('.avatar-frame');
  const elPulse = $('.pulse');
  const elPulseRings = Array.from(document.querySelectorAll('.pulse i'));
  const elDashed = $('.dashed');
  const elBootTitle = $('.boot-title');
  const elBootCaption = $('.boot-caption');
  const elWave = $('.wave');
  const elBootGrid = $('.boot-grid');
  const elBootCorners = $('.boot-corners');
  const elBootLogs = $('.boot-logs');
  const elBootLogLines = Array.from(document.querySelectorAll('.boot-logs div'));
  const elShade = $('.shade');
  const elSyncFill = $('.sync-fill');
  const elRatio = $('#ratio');
  const elSyncPhase = $('.sync-phase');
  const elTimecode = $('#timecode');
  const elElapsed = $('#elapsed');

  // Split the selected image's own contours once; no particles are allocated per frame.
  const canvas = $('.line-art'), ctx = canvas.getContext('2d');
  function preparePaths(raw) { if(!Array.isArray(raw))raw=[]; return raw.map(points => {
    let total=0;
    for(let i=1;i<points.length;i++)total+=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);
    const full=new Path2D();points.forEach((point,i)=>i?full.lineTo(...point):full.moveTo(...point));
    return {points,total,full};
  }); }
  function prepareFragments(paths){
    const result=[],span=Math.max(18,paths.reduce((sum,path)=>sum+path.total,0)/1400);
    const noise=n=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
    function add(points){
      if(points.length<2)return;
      const first=points[0],last=points[points.length-1],x=(first[0]+last[0])/2,y=(first[1]+last[1])/2;
      const seed=result.length+1;
      const angle=(noise(seed+563)-.5)*Math.PI*2;
      const seedVal=noise(seed+811)*Math.PI*2;
      const cosAngle=Math.cos(angle), sinAngle=Math.sin(angle);
      const cosSeed=Math.cos(seedVal), sinSeed=Math.sin(seedVal);
      const baseSize=0.16;
      const baseCs=cosAngle*baseSize, baseSn=sinAngle*baseSize;
      const basePoints=[first, last].map(pt=>[
        (pt[0]-x)*baseCs - (pt[1]-y)*baseSn,
        (pt[0]-x)*baseSn + (pt[1]-y)*baseCs
      ]);
      result.push({
        x, y,
        points: points.map(pt=>[pt[0]-x,pt[1]-y]),
        rawPoints: points,
        basePoints,
        sx: (x+(noise(seed)-.5)*440+1536)%1536,
        sy: (y+(noise(seed+271)-.5)*300+1024)%1024,
        angle, seed: seedVal,
        cosAngle, sinAngle,
        cosSeed, sinSeed
      });
    }
    for(const path of paths){
      if(path.points.length<2)continue;
      let chunk=[path.points[0]],used=0;
      for(let i=1;i<path.points.length;i++){
        let a=path.points[i-1];const b=path.points[i];
        let length=Math.hypot(b[0]-a[0],b[1]-a[1]);
        while(length>0&&used+length>=span){
          const ratio=(span-used)/length,cut=[a[0]+(b[0]-a[0])*ratio,a[1]+(b[1]-a[1])*ratio];
          chunk.push(cut);add(chunk);chunk=[cut];a=cut;used=0;
          length=Math.hypot(b[0]-a[0],b[1]-a[1]);
        }
        if(length>0){chunk.push(b);used+=length;}
      }
      add(chunk);
    }
    result.sort((a,b)=>a.x-b.x);
    return result;
  }
  let paths=preparePaths(window.CONTOUR_PATHS || []),fragments=prepareFragments(paths);
  let identityTexture=null,identityPieces=[];
  const settledCanvas=document.createElement('canvas');
  settledCanvas.width=1536;settledCanvas.height=1024;
  const settledCtx=settledCanvas.getContext('2d');
  settledCtx.strokeStyle='#c8c0cd';settledCtx.lineWidth=1.25;settledCtx.lineCap='round';settledCtx.lineJoin='round';
  let lastSettledIndex=0,lastSettledP=-1;

  function resetSettledContours(){
    settledCtx.clearRect(0,0,1536,1024);
    lastSettledIndex=0;
    lastSettledP=-1;
  }
  function releaseIdentityTexture(){
    if(identityTexture)identityTexture.width=identityTexture.height=0;
    identityTexture=null;identityPieces=[];
  }
  function prepareIdentityTexture(){
    releaseIdentityTexture();
    const bounds=canvas.getBoundingClientRect(),scale=Math.max(bounds.width/1536,bounds.height/1024);
    if(!scale)return;
    const ox=bounds.left+(bounds.width-1536*scale)/2,oy=bounds.top+(bounds.height-1024*scale)/2;
    const rect=node=>{const r=node.getBoundingClientRect();return {x:(r.left-ox)/scale,y:(r.top-oy)/scale,w:r.width/scale,h:r.height/scale};};
    const texture=document.createElement('canvas');texture.width=1536;texture.height=1024;
    const ink=texture.getContext('2d');ink.imageSmoothingEnabled=false;
    const avatar=rect($('.avatar')),radar=rect($('.radar')),border=rect($('.avatar-frame'));
    const cx=radar.x+radar.w/2,cy=radar.y+radar.h/2;
    ink.strokeStyle='#a397a0';ink.lineWidth=1.3;
    ink.beginPath();ink.arc(cx,cy,radar.w*.4425,0,Math.PI*2);ink.stroke();
    ink.setLineDash([9,12]);ink.globalAlpha=.4;
    ink.beginPath();ink.arc(cx,cy,radar.w*.3775,0,Math.PI*2);ink.stroke();ink.setLineDash([]);ink.globalAlpha=.8;
    for(let i=0;i<60;i++){
      const a=i*Math.PI/30,r0=radar.w*(i%5===0?.4525:.46),r1=radar.w*(i%5===0?.4975:.48);
      ink.beginPath();ink.moveTo(cx+Math.sin(a)*r0,cy-Math.cos(a)*r0);ink.lineTo(cx+Math.sin(a)*r1,cy-Math.cos(a)*r1);ink.stroke();
    }
    ink.globalAlpha=1;ink.strokeRect(border.x,border.y,border.w,border.h);
    ink.drawImage($('.avatar'),avatar.x,avatar.y,avatar.w,avatar.h);
    // Neutralize the bitmap once, not with an expensive live blur/filter on every frame.
    ink.globalCompositeOperation='saturation';ink.fillStyle='#999';
    ink.fillRect(avatar.x,avatar.y,avatar.w,avatar.h);ink.globalCompositeOperation='source-over';
    const textBounds=[];
    for(const selector of ['.boot-title','.boot-caption']){
      const node=$(selector),r=rect(node),style=window.getComputedStyle(node);
      if(node.textContent)textBounds.push(r);
      ink.font=`${style.fontWeight} ${parseFloat(style.fontSize)/scale}px ${style.fontFamily}`;
      ink.textAlign='center';ink.textBaseline='middle';ink.fillStyle=style.color;
      ink.globalAlpha=selector==='.boot-caption'?.5:1;
      ink.letterSpacing=`${(parseFloat(style.letterSpacing)||0)/scale}px`;
      ink.fillText(node.textContent,r.x+r.w/2,r.y+r.h/2,r.w);
    }
    ink.globalAlpha=1;
    ink.globalCompositeOperation='source-atop';ink.globalAlpha=.24;ink.fillStyle='#9b9099';
    ink.fillRect(0,0,1536,1024);ink.globalAlpha=1;ink.globalCompositeOperation='source-over';
    // Geometric tile selection works for file:// images too, without reading protected pixels.
    const tile=36,boxes=[avatar,border,...textBounds];
    const overlaps=(x,y,r)=>x<r.x+r.w&&x+tile>r.x&&y<r.y+r.h&&y+tile>r.y;
    for(let y=0;y<1024;y+=tile)for(let x=0;x<1536;x+=tile){
      const w=Math.min(tile,1536-x),h=Math.min(tile,1024-y);
      const distance=Math.hypot(x+w/2-cx,y+h/2-cy);
      const onRing=[.3775,.4425,.48].some(radius=>Math.abs(distance-radar.w*radius)<tile);
      if(onRing||boxes.some(box=>overlaps(x,y,box))){
        const hw=w/2,hh=h/2;
        identityPieces.push({
          x,y,w,h,cx:x+hw,cy:y+hh,hw,hh,
          target:fragments[(identityPieces.length*37)%fragments.length]
        });
      }
    }
    identityTexture=texture;
    canvas.dataset.identityPieces=String(identityPieces.length);
    fragments.forEach((fragment,i)=>{
      const tile=identityPieces[i%identityPieces.length];
      fragment.ix=tile?tile.cx:cx;fragment.iy=tile?tile.cy:cy;
    });
    for(const tile of identityPieces){tile.target.ix=tile.cx;tile.target.iy=tile.cy;}
  }
  function drawIdentityPieces(spread){
    if(!identityTexture||spread>=1)return;
    const fade=1-smooth((spread-.03)/.43),size=1-.9*spread;
    if(fade<=0)return;
    ctx.globalAlpha=fade;ctx.imageSmoothingEnabled=false;
    for(let i=0;i<identityPieces.length;i++){
      const tile=identityPieces[i];
      const target=tile.target;
      const x=tile.cx*(1-spread)+target.sx*spread,y=tile.cy*(1-spread)+target.sy*spread;
      const angle=target.angle*spread,cs=Math.cos(angle)*size,sn=Math.sin(angle)*size;
      ctx.setTransform(cs,sn,-sn,cs,x,y);
      ctx.drawImage(identityTexture,tile.x,tile.y,tile.w,tile.h,-tile.hw,-tile.hh,tile.w,tile.h);
    }
    ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
  }
  let lastTrace=-1;
  function trace(p,drift=0,spread=1) {
    const stamp=p===1?1:p+drift*.00001;
    if(stamp===lastTrace)return;lastTrace=stamp;
    ctx.clearRect(0,0,1536,1024);
    ctx.strokeStyle='#c8c0cd';ctx.lineWidth=1.25;ctx.lineCap='round';ctx.lineJoin='round';
    if(p===1){
      ctx.globalAlpha=1;
      for(let i=0;i<paths.length;i++) ctx.stroke(paths[i].full);
      return;
    }
    drawIdentityPieces(spread);
    if(spread<=.04) return;

    if(p < lastSettledP){
      resetSettledContours();
    }
    lastSettledP = p;

    const front = p * 1.5 - 0.25;
    const settledThreshold = 1536 * (front - 0.16);
    const activeThreshold = 1536 * (front + 0.16);

    let settledEnd = 0;
    while(settledEnd < fragments.length && fragments[settledEnd].x <= settledThreshold){
      settledEnd++;
    }

    if(settledEnd > lastSettledIndex){
      settledCtx.beginPath();
      for(let i = lastSettledIndex; i < settledEnd; i++){
        const pts = fragments[i].rawPoints;
        for(let j = 0; j < pts.length; j++){
          if(j) settledCtx.lineTo(pts[j][0], pts[j][1]);
          else settledCtx.moveTo(pts[j][0], pts[j][1]);
        }
      }
      settledCtx.stroke();
      lastSettledIndex = settledEnd;
    }

    const alpha = .82 * smooth((spread - .04) / .36);
    ctx.globalAlpha = alpha;

    if(lastSettledIndex > 0){
      ctx.drawImage(settledCanvas, 0, 0);
    }

    let activeEnd = settledEnd;
    while(activeEnd < fragments.length && fragments[activeEnd].x < activeThreshold){
      activeEnd++;
    }

    const driftX = drift * .8, driftY = drift * .6;
    const sinDriftX = Math.sin(driftX), cosDriftX = Math.cos(driftX);
    const sinDriftY = Math.sin(driftY), cosDriftY = Math.cos(driftY);
    const inv1536 = 1 / 1536, inv032 = 1 / 0.32;
    const spreadW = 7 * spread;

    ctx.beginPath();

    // 1. Transitioning band
    for(let f = settledEnd; f < activeEnd; f++){
      const fragment = fragments[f];
      const rawRatio = (front - fragment.x * inv1536 + 0.16) * inv032;
      const arrival = smooth(rawRatio);
      const loose = 1 - arrival;
      const angle = fragment.angle * loose;
      const cs = Math.cos(angle), sn = Math.sin(angle);
      const sx = (fragment.ix ?? fragment.sx) * (1 - spread) + fragment.sx * spread;
      const sy = (fragment.iy ?? fragment.sy) * (1 - spread) + fragment.sy * spread;
      const sinNoise = sinDriftX * fragment.cosSeed + cosDriftX * fragment.sinSeed;
      const cosNoise = cosDriftY * fragment.cosSeed - sinDriftY * fragment.sinSeed;
      const x = sx * loose + fragment.x * arrival + sinNoise * (spreadW * loose);
      const y = sy * loose + fragment.y * arrival + cosNoise * (spreadW * loose);
      const size = 0.16 + 0.84 * arrival;
      const pts = fragment.points;
      for(let i = 0; i < pts.length; i++){
        const pt = pts[i];
        const px = x + (pt[0] * cs - pt[1] * sn) * size;
        const py = y + (pt[0] * sn + pt[1] * cs) * size;
        if(i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
    }

    // 2. Unstarted floating fragments
    for(let f = activeEnd; f < fragments.length; f++){
      const fragment = fragments[f];
      const sx = (fragment.ix ?? fragment.sx) * (1 - spread) + fragment.sx * spread;
      const sy = (fragment.iy ?? fragment.sy) * (1 - spread) + fragment.sy * spread;
      const sinNoise = sinDriftX * fragment.cosSeed + cosDriftX * fragment.sinSeed;
      const cosNoise = cosDriftY * fragment.cosSeed - sinDriftY * fragment.sinSeed;
      const x = sx + sinNoise * spreadW;
      const y = sy + cosNoise * spreadW;
      const bp0 = fragment.basePoints[0], bp1 = fragment.basePoints[1];
      ctx.moveTo(x + bp0[0], y + bp0[1]);
      ctx.lineTo(x + bp1[0], y + bp1[1]);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  for(let i=0;i<60;i++){
    const tick=document.createElementNS('http://www.w3.org/2000/svg','line');
    const angle=i*Math.PI/30,inner=i%5===0?181:184;
    tick.setAttribute('x1',200+Math.sin(angle)*inner);tick.setAttribute('y1',200-Math.cos(angle)*inner);
    tick.setAttribute('x2',200+Math.sin(angle)*(i%5===0?199:192));tick.setAttribute('y2',200-Math.cos(angle)*(i%5===0?199:192));
    tick.style.opacity=i%5===0?'.9':'.55';$('.ticks').appendChild(tick);
  }
  let lastStage='';
  function render(t) {
    const s=t/1000, p=progress(t);
    const color=smooth((s-7.18)/.24);
    const collapse=smooth((s-11)/.3);
    const pinch=smooth((s-11.65)/.35);
    const dissolve=smooth((s-4.18)/.56);
    const closing=s>=11;

    root.classList.toggle('closing',closing);
    document.body.classList.toggle('closing',closing);

    if (collapse > 0) {
      scene.style.opacity=collapse>=1?'0':'1';
      scene.style.transform=`scaleY(${Math.max(.001,1-collapse)})`;
      scene.style.filter=closing?`brightness(${1+collapse*3})`:'none';
    } else if (scene.style.opacity !== '1') {
      scene.style.opacity='1';
      scene.style.transform='none';
      scene.style.filter='none';
    }

    if (s >= 7.0 && s <= 7.5) {
      elTransitionFlash.style.opacity=String(reduced?0:smooth((s-7.18)/.035)*(1-smooth((s-7.22)/.2))*.8);
    } else if (elTransitionFlash.style.opacity !== '0') {
      elTransitionFlash.style.opacity='0';
    }

    if (s >= 11.0) {
      elShutterLine.style.opacity=String(smooth((s-11.15)/.15)*(1-smooth((s-11.96)/.04)));
      elShutterLine.style.transform=`scaleX(${1-pinch})`;
    } else if (elShutterLine.style.opacity !== '0') {
      elShutterLine.style.opacity='0';
    }

    if(closing&&!revealed){revealed=true;send('reveal');}

    if (s < 4.18) {
      if (intro.style.opacity !== '1') intro.style.opacity = '1';
      elIdentity.style.opacity=String(smooth((s-1.05)/.65));
      elIdentity.style.transform=`translate(-50%,-43%) scale(${.94+.06*smooth((s-1.05)/.65)})`;
      const beat=reduced?0:Math.pow((1-Math.cos(Math.max(0,s-1.05)*Math.PI*2/1.08))/2,2);
      elAvatarFrame.style.transform=`translateY(${-4*beat}px) scale(${1+.025*beat})`;
      if (s < 1.7) {
        elPulse.style.opacity=String(1-smooth((s-1.15)/.5));
        for(let i=0;i<elPulseRings.length;i++){
          const ring=elPulseRings[i];
          const phase=(s*.75+i*.5)%1;
          ring.style.transform=`scale(${.25+phase*.9})`;ring.style.opacity=String((1-phase)*.8);
        }
      }
      elDashed.style.transformOrigin='200px 200px';elDashed.style.transform=`rotate(${reduced?0:s*16}deg)`;
      elBootTitle.style.clipPath=`inset(0 ${(1-clamp((s-1.9)/.7))*100}% 0 0)`;
      elBootCaption.style.opacity=String(smooth((s-2.5)/.35)*.5);
      elWave.style.transform=`scaleY(${reduced?1:.6+Math.sin(s*6)*.4})`;
      elBootGrid.style.opacity=String(smooth((s-.8)/.6)*(1-color));
      elBootCorners.style.opacity=String(smooth((s-.8)/.6)*(1-color));
      elBootLogs.style.opacity=String((1-color)*.55);
      if (s < 2.5) {
        for(let i=0;i<elBootLogLines.length;i++) elBootLogLines[i].style.opacity=String(smooth((s-.15-i*.38)/.3));
      }
    } else if (intro.style.opacity !== '0') {
      intro.style.opacity='0';
    }

    const assembling=clamp((s-5.08)/2.02);
    if(s>=4.18&&s<7.43)trace(reduced?1:assembling,s-4.18,reduced?1:dissolve);
    if(s>=4.74&&identityTexture)releaseIdentityTexture();
    canvas.style.opacity=String((reduced?smooth((s-4.18)/.56):s>=4.18?1:0)*(1-color));
    art.style.opacity=String(color);
    art.style.transform=reduced?'none':`scale(${1+.012*smooth((s-7.42)/3.58)})`;
    elShade.style.opacity=String(color);
    hud.style.opacity=String(smooth((s-7.24)/.45));
    elSyncFill.style.transform=`scaleX(${p})`;

    if (s >= 7.18 && s <= 8.2) {
      sweep.style.opacity=reduced?'0':String(Math.sin(clamp((s-7.18)/.8)*Math.PI)*.1);
      sweep.style.transform=`translateX(${(-60+clamp((s-7.18)/.8)*120)}%)`;
    } else if (sweep.style.opacity !== '0') {
      sweep.style.opacity='0';
    }

    if (color > 0) {
      for(let i=0;i<particles.length;i++){
        const node=particles[i];
        node.style.opacity=String(color*(.12+.28*(.5+.5*Math.sin(s*.9+i))));
        node.style.transform=`translate(${Math.sin(s*.4+i)*8}px,${-s*(2+i%3)}px)`;
      }
    }
    subtitle.style.opacity=String(smooth((s-7.6)/.4)*(1-smooth((s-10.65)/.25)));

    if(Math.abs(t-lastUI)>60 || t===0 || t>=duration) {
      lastUI=t;
      elRatio.textContent=`${(p*100).toFixed(2).padStart(5,'0')}%`;
      elSyncPhase.textContent=s<6.5?'INITIALIZING':p<1?'SYNCHRONIZING':'SYNC COMPLETE';
      elTimecode.textContent=`00:${String(Math.floor(s)).padStart(2,'0')}:${String(Math.floor(s%1*30)).padStart(2,'0')}`;
      slider.value=String(s);
      elElapsed.innerHTML=`${s.toFixed(1).padStart(4,'0')} <span>/ 12.0s</span>`;
      const stage=s>=11?'shutter':s<1.15?'pulse':s<4.18?'identity':s<4.74?'dispersing':s<5.08?'scattered':s<7.18?'drawing':s<7.43?'colorize':'portrait';
      if(stage!==lastStage){lastStage=stage;root.dataset.stage=stage;}
    }
  }
  function updateButton() { pause.textContent=playing?t('btnPause'):t('btnPlay'); root.dataset.playing=String(playing); }
  function stop() { playing=false; cancelAnimationFrame(frame); frame=0; updateButton(); }
  function finish(skipped=false) {
    stop(); elapsed=duration; render(elapsed); completed=true;
    root.classList.add('finished'); root.dataset.completed='true';
    pause.textContent=t('btnEnded'); pause.disabled=true;
    $('.end-description').textContent=mode==='launch'?t('descLaunchingCodex'):skipped?t('descSkipped'):t('endDesc');
    send('complete');
  }
  function tick(now) {
    if(!playing)return;
    const t0=performance.now();
    elapsed=Math.min(duration,now-origin); render(elapsed);
    window.__aemeathRenderMs=performance.now()-t0;
    window.__aemeathElapsed=elapsed;
    if(elapsed>=duration){finish();return;}
    frame=requestAnimationFrame(tick);
  }
  function warmIdentityTexture(){
    if(reduced||identityTexture||elapsed>=4740)return;
    const restoreTime=elapsed;
    // Prepare the final avatar layout before starting the playback clock, never in tick().
    render(4179);prepareIdentityTexture();drawIdentityPieces(0);
    ctx.clearRect(0,0,1536,1024);lastTrace=-1;resetSettledContours();render(restoreTime);
  }
  function play() {
    if(!loaded)return;
    if(elapsed>=duration)elapsed=0;
    warmIdentityTexture();
    if(elapsed<4180)resetSettledContours();
    completed=false; root.classList.remove('finished'); root.dataset.completed='false';
    pause.disabled=false; origin=performance.now()-elapsed; playing=true;updateButton();
    cancelAnimationFrame(frame);frame=requestAnimationFrame(tick);
  }
  function replay(){revealed=false;hiddenPause=false;stop();elapsed=0;lastUI=-Infinity;resetSettledContours();render(0);play();}
  $('#replay').addEventListener('click',replay);$('.replay-end').addEventListener('click',replay);
  pause.addEventListener('click',()=>{hiddenPause=false;if(playing){elapsed=Math.min(duration,performance.now()-origin);stop();render(elapsed);}else play();});
  $('.skip').addEventListener('click',()=>finish(true));
  slider.addEventListener('input',()=>{hiddenPause=false;stop();elapsed=Number(slider.value)*1000;warmIdentityTexture();resetSettledContours();if(elapsed>=duration){finish();return;}lastUI=-Infinity;completed=false;root.classList.remove('finished');root.dataset.completed='false';pause.disabled=false;render(elapsed);});
  window.addEventListener('keydown',event=>{
    if((event.metaKey||event.ctrlKey)&&event.altKey&&event.code==='KeyB'){
      event.preventDefault();if(!$('#settings-dialog').open)openSettings();return;
    }
    if($('#settings-dialog').open)return;
    if(event.key==='Escape'){event.preventDefault();finish(true);}
    if(event.code==='Space'&&event.target.tagName!=='INPUT'&&event.target.tagName!=='BUTTON'){event.preventDefault();pause.click();}
  });
  document.addEventListener('visibilitychange',()=>{
    if(native)return;
    if(document.hidden&&playing){elapsed=Math.min(duration,performance.now()-origin);hiddenPause=true;stop();}
    else if(!document.hidden&&hiddenPause&&!completed){hiddenPause=false;play();}
  });
  // Narrow native bridge: the host may select launch mode or report its own launch error.
  window.launcherUI={
    openSettings,
    beginLaunch(){mode='launch';document.body.classList.add('launch-mode');replay();},
    error(message){stop();scene.style.opacity='0';root.classList.add('finished');$('.end-description').textContent=message;$('.eyebrow').textContent='LAUNCH UNAVAILABLE';$('.end-screen h1').textContent='暂时无法打开 Codex';},
    waiting(){ $('.end-description').textContent='正在等待 Codex 打开…'; }
  };
  if(native){
    document.body.classList.add('native');
  }
  function ready(){if(loaded)return;loaded=true;render(0);send('ready');if(window.AEMEATH_OPEN_SETTINGS||new URLSearchParams(location.search).has('settings'))openSettings();else play();}
  function failed(){stop();$('#asset-error').hidden=false;send('assetError');}
  let savedImages={},pendingImages={},busy=false;
  const settings=$('#settings-dialog'),status=$('#settings-status');
  const textFields=[
    {key:'introTitle',input:'#intro-title',target:'.boot-title',fallbackKey:'defaultIntroTitle',limit:16},
    {key:'introCaption',input:'#intro-caption',target:'.boot-caption',fallbackKey:'defaultIntroCaption',limit:48},
    {key:'artworkSubtitle',input:'#artwork-subtitle',target:'#subtitle',fallbackKey:'defaultArtworkSubtitle',limit:60}
  ];
  const textValue=(images,field)=>{
    if(typeof images[field.key]==='string'&&images[field.key].length>0)return images[field.key].slice(0,field.limit);
    return t(field.fallbackKey);
  };
  function setLanguage(lang,updateInputs=false){
    if(!I18N[lang])return;
    const oldLang=currentLang;
    currentLang=lang;
    pendingImages.lang=lang;
    try{localStorage.setItem('aemeath-lang',lang);}catch{}
    document.querySelectorAll('.lang-btn').forEach(btn=>{
      btn.classList.toggle('active',btn.dataset.lang===lang);
    });
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.dataset.i18n;
      if(key&&I18N[lang][key]!==undefined)el.textContent=I18N[lang][key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el=>{
      const key=el.dataset.i18nAria;
      if(key&&I18N[lang][key]!==undefined)el.setAttribute('aria-label',I18N[lang][key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      const key=el.dataset.i18nTitle;
      if(key&&I18N[lang][key]!==undefined)el.setAttribute('title',I18N[lang][key]);
    });
    if(updateInputs){
      for(const field of textFields){
        const input=$(field.input);
        const oldFallback=I18N[oldLang]?.[field.fallbackKey];
        if(!pendingImages[field.key]||input.value===oldFallback){
          delete pendingImages[field.key];
          input.value=t(field.fallbackKey);
          $(field.target).textContent=t(field.fallbackKey);
        }
      }
    }
    if(pause)updateButton();
    if(status)status.textContent=t('statusDefault');
  }
  document.querySelectorAll('.lang-btn').forEach(btn=>{
    btn.addEventListener('click',()=>setLanguage(btn.dataset.lang,true));
  });
  function thumbnails(){
    $('#avatar-preview').src=pendingImages.avatar||assets.avatar;
    $('#artwork-preview').src=pendingImages.artwork||assets.artwork;
    $('#wallpaper-strength').value=String(pendingImages.wallpaperStrength??42);
    $('#wallpaper-value').textContent=$('#wallpaper-strength').value+'%';
    for(const field of textFields)$(field.input).value=textValue(pendingImages,field);
  }
  function openSettings(){
    if(mode==='launch'||settings.open)return;
    hiddenPause=false;stop();pendingImages={...savedImages};
    if(savedImages.lang)setLanguage(savedImages.lang,false);
    thumbnails();
    status.textContent=t('statusDefault');
    settings.returnValue='';settings.showModal();send('settings-open');
  }
  function setBusy(value){
    busy=value;
    settings.querySelectorAll('input,button').forEach(node=>node.disabled=value);
  }
  async function applyImages(images){
    if(images.lang&&I18N[images.lang])setLanguage(images.lang,false);
    releaseIdentityTexture();
    art.src=images.artwork||assets.artwork;$('.avatar').src=images.avatar||assets.avatar;
    await Promise.all([art,$('.avatar')].map(img=>img.decode()));
    let contourData=images.contours;
    if(!contourData||!contourData.length){
      if(window.imageSettings?.extractContours){
        try{contourData=window.imageSettings.extractContours(art);}catch(e){}
      }
    }
    if(!contourData||!contourData.length){contourData=window.CONTOUR_PATHS||[];}
    paths=preparePaths(contourData);fragments=prepareFragments(paths);lastTrace=-1;resetSettledContours();
    if(!paths.length)throw new Error('图片轮廓数据缺失');
    for(const field of textFields)$(field.target).textContent=textValue(images,field);
    $('.boot-title').classList.toggle('long-title',Array.from(textValue(images,textFields[0])).length>6);
    send('background',{image:art.src,strength:images.wallpaperStrength??42});
  }
  for(const field of textFields)$(field.input).addEventListener('input',event=>{
    pendingImages[field.key]=event.target.value.slice(0,field.limit);
  });
  $('#wallpaper-strength').addEventListener('input',event=>{
    pendingImages.wallpaperStrength=Number(event.target.value);
    $('#wallpaper-value').textContent=event.target.value+'%';
  });
  $('#image-settings').addEventListener('click',openSettings);
  if(window.AEMEATH_EXTERNAL){$('#restore-appearance').hidden=false;$('#restore-appearance').addEventListener('click',()=>send('restore'));}
  settings.addEventListener('cancel',event=>{if(busy)event.preventDefault();});
  settings.addEventListener('close',()=>{
    if(!loaded)return;
    if(settings.returnValue==='preview'){send('settings-close');replay();}
    else finish(true);
  });
  for(const kind of ['avatar','artwork'])$('#'+kind+'-file').addEventListener('change',async event=>{
    const file=event.target.files[0];if(!file)return;
    setBusy(true);status.textContent=kind==='artwork'?t('statusGeneratingContours'):t('statusPreparingAvatar');
    // Let the progress text paint before the one-time contour computation.
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    try{
      pendingImages={...pendingImages,...await window.imageSettings.importImage(file,kind)};thumbnails();
      status.textContent=t('statusImageReady');
    }catch(error){status.textContent=error.message;}
    finally{setBusy(false);event.target.value='';}
  });
  $('#reset-images').addEventListener('click',()=>{
    const keepLang=pendingImages.lang||currentLang;
    pendingImages={lang:keepLang};
    thumbnails();
    status.textContent=t('statusResetDone');
  });
  $('#preview-images').addEventListener('click',async()=>{
    setBusy(true);status.textContent=t('statusSaving');
    try{
      pendingImages.lang=currentLang;
      await applyImages(pendingImages);await window.imageSettings.save(pendingImages);savedImages={...pendingImages};settings.close('preview');
    }catch(error){await applyImages(savedImages);status.textContent=t('statusSaveFailed')+error.message;}
    finally{setBusy(false);}
  });
  window.imageSettings.load().catch(()=>({})).then(async images=>{
    savedImages=images;
    const initialLang=images.lang||(function(){
      try{const s=localStorage.getItem('aemeath-lang');if(s&&I18N[s])return s;}catch{}
      return 'vi';
    })()||'vi';
    setLanguage(initialLang,false);
    try{await applyImages(images);}catch{savedImages={};await applyImages({});}
    ready();
  }).catch(failed);
})();
