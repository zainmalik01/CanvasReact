import React,{useEffect} from 'react';
import logo from './logo.svg';
import './App.scss';
import {fabric} from 'fabric';
// const fabric = require('fabric');
function App() {

  let  title = 'canvas-ocr';
  let canvas: any;
  let buildZone: any;
  let wrapper: any;
  let paddingShift: any;
  let styleZone = document.getElementById('styleZone');
  let colors: any = ['#43c8bf'];
  let defaultColor = colors[0];
  let activeElement: any = null;
  let isSelectedClass = 'isSelected';
  let strokeWidth = 2;
  let strokeColor = defaultColor;
  let fileData: any = null;
  let previewUrl: any = null;
  let filePath: any = null;
  let data = [];
  let dimension = { width: 0, height: 0 }
  
  const createCanvas=()=> {
    let scaleRatio = Math.min(1000.0 / dimension.width, 1000.0 / dimension.width);
    console.log('scale ratio',scaleRatio)
    canvas = new fabric.Canvas('canvas',
      {
        width:dimension.width,
        height: dimension.height,

        // backgroundImage: previewUrl
      }
      // {  }
    );
    canvas.setDimensions({ width: canvas.getWidth() * scaleRatio, height: canvas.getHeight() * scaleRatio });

    buildZone = document.getElementById('buildZone');
    wrapper = document.getElementById('wrapper');
    paddingShift = 60;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    

    // code for removing selected shape or  clearing the canvas
    RemoveShapes();



   

    colors.forEach((color: any, i: any) => {
      console.log('a');
      const span: any = document.createElement('span');
      span.style.background = color;

      if (i === 0) {
        console.log('a');
        span.className = isSelectedClass;
        activeElement = span;
      }

      let icon = document.createElement('i');
      icon.className = 'feather icon-check';
      span.appendChild(icon);

      styleZone && styleZone.appendChild(span);

      span.addEventListener('click', (event: any) => {
        console.log('a');
        if (span.className !== isSelectedClass) {
          console.log('a');
          span.classList.toggle(isSelectedClass);
          activeElement && activeElement.classList.remove(isSelectedClass);
          activeElement = span;
          strokeColor = color;
        }

        if (canvas.getActiveObject()) {
          const activeObjects = canvas.getActiveObjects();
          console.log('a');
          if (!activeObjects.length) return;
          // let self = this
          console.log('a');

          activeObjects.forEach(function (object: any) {
            console.log('a');
            object.set('stroke', strokeColor);
          });

          canvas.renderAll();
        }
      })
    });

    // code for drawing squre
    drawSquare();
    // mew code for scale 
   scaleFilter(previewUrl,scaleRatio) 
    

    
    // old code 
    // canvas.setBackgroundImage(previewUrl, canvas.renderAll.bind(canvas), {
    //   //   width: 500,
    //   //   height: 500,
    //   originX: 'left',
    //   originY: 'top',
    //   scaleX: scaleRatio,
    //   scaleY: scaleRatio,
    // })
    


  }
  
  const RemoveShapes=()=>{
    let temp = document.getElementById('clear');
    if (temp != null) {

      // remove object by clear button
      temp.addEventListener('click', () => {
        !deleteActiveObjects() && 
        canvas.clear();
      });

   
    }

    // remove object by choosing key down
    document.addEventListener('keydown', (event) => {
      console.log('a');
      event.keyCode === 46 && deleteActiveObjects();
    })
  }

  const drawSquare=()=>
  {
    let squaretemp: any = document.getElementById('square')
    console.log(squaretemp);
    if (squaretemp != null) {
      squaretemp.addEventListener('click', () => {
        console.log('a');
        canvas.add(new fabric.Rect({
          strokeWidth: strokeWidth,
          stroke: strokeColor,
          fill: 'transparent',
          width: 50,
          height: 50,
          left: 100,
          top: 100
        }));
      });
    }
  }
  const scaleFilter=(imgUrl: string,scaleRatio:any)=>{
    // let self=this
    fabric.Image.fromURL(imgUrl, function(img:any) {
      img.set({
        // left: 10,
        // right:10,
        scaleX: scaleRatio,
        scaleY: scaleRatio,
        // top: 10
      });
      img.resizeFilter = new fabric.Image.filters.Resize({
        resizeType: 'lanczos'
      });
      img.applyResizeFilters();
      // self.canvas.add(img);
      canvas.setBackgroundImage(previewUrl, canvas.renderAll.bind(canvas), {
        //   width: 500,
        //   height: 500,
        originX:'left',
        originY:'top',
        scaleX: scaleRatio,
        scaleY: scaleRatio,
        })
    }, {
      crossOrigin: 'anonymous'
    });
  }
  // Resize canvas
 const resizeCanvas=()=> {
    // Width
    const newWidth = canvas.getWidth() + (window.innerWidth - (buildZone.offsetWidth + paddingShift));
    if (newWidth < 640 && newWidth > 200) canvas.setWidth(newWidth);

    // Height
    const newHeight = canvas.getHeight() + (window.innerHeight - (wrapper.offsetHeight + paddingShift));
    if (newHeight < 360 && newHeight > 250) canvas.setHeight(newHeight);
  }


  const deleteActiveObjects=()=> {
    const activeObjects = canvas.getActiveObjects();
    if (!activeObjects.length) return false;

    if (activeObjects.length) {
      // let self = this
      console.log('a');
      activeObjects.forEach(function (object: any) {
        console.log('a');
        canvas.remove(object);
      });
    } else {
      console.log('a');
      canvas.remove(activeObjects);
    }

    return true;
  }


  const fileProgress=(fileInput: any)=> {
    console.log(fileInput)

    filePath = fileInput.target.value;
    fileData = fileInput.target.files[0];
    console.log('file path', filePath)
    console.log('file data', fileData);
    console.log(fileData)
    preview();
  }
  {/* dimension = { width: 0, height: 0 } */}
  const preview=()=>{
    // Show preview
    if (!fileData || !fileData.type) {
      return;
    }
    var mimeType = fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    console.log(mimeType)
    var reader = new FileReader();

    reader.readAsDataURL(fileData);
    console.log('reader',reader)
    // let self = this
    reader.onload = (_event) => {
      previewUrl = reader.result;
      var img = document.createElement("img")
      img.setAttribute("src", previewUrl)
      setTimeout(function () {
        dimension.height = img.height
        dimension.width = img.width
        console.log(img.height, img.width);
      }, 0)

      // originalRaw = JSON.parse((JSON.stringify(previewUrl)))
    }
  }


  return (
    <>
    <div id="wrapper">
	<div id="buildZone">
		<canvas id="canvas"></canvas>
		<div id="controls" style={{zIndex: 9999,position:"absolute"}}>
			<i  id="square" className="feather icon-square"></i>
			{/* <!-- <i id="circle" class="feather icon-circle"></i>
			<i id="triangle" class="feather icon-triangle"></i> --> */}
			<i id="clear" className="feather icon-trash"></i>
		</div>
	</div>
	{/* <div id="styleZone"></div> */}
  <div>
  <button>
      <label  className="custom-file-upload1 bg-green  upload-btn">
        <i className="icon-upload"></i> Upload
      </label>
      <input id="file-upload" type="file" name="image" 
      onChange={(e)=>{fileProgress(e)}}/>
    
    </button>
      
      <button onClick={createCanvas}>Display</button>
  </div>
  </div>
    </>
  );
}

export default App;
