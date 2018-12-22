SPACE SHIP  
==========
WebGL_Test version 1.1.21   
=========================  
  
What's New  
===========  
Add Gravity Effect from planets    
  
INSTALL & START  
-----------------  
  
1.```npm install```  
2.```npm start```  
  
SHIP OPERATION  
------------
Injection  
  A key----Front  
  Z key----Back
  arrow keys-----Up,Down,Left,Right

Turn  
  W key----rotate clockwise  
  Q key----rotate unclockwise  
  Shift + arrow keys----Turn to Up,Down,Left,Right
  
  
  
  オブジェクトの説明  
  ----------------  
  libFileRelationship  
  	必要なファイルを記しておく。  
	登録の仕方
	libFileRelationship.create('ライブラリ名');  
	libFileRelationship.ライブラリ名 = '必要なライブラリ名'  
	libFileRelationship.ライブラリ名 = '必要なライブラリ名'  
			...
 
 	onload()の中の最初の方に、ファイル内に記してあるコードを入れておくと、  
	start();関数から処理が始まる  

 


   #WebGL手順  
   ----------  


   ##UnitsToDrawオブジェクトの作成  
  --------------------------------  
   ###UnitsToDrawオブジェクトを作るのに必要なオブジェクト

   ####oMatricesオブジェクト : Matrixの計算に使う関数を指定する  
   ------------------------------------------------------------  
   
   使うmatrixは4種類
   1.modelView
   2.manipulatedRotation
   3.manipulated
   4.notmanipulated
   それぞれのmatrixは位置決定のための変化量を次々に受けて、時間的にも静的にも計算しなおされてから、シェーダーに送られる。  

   その計算に使う関数を以下に示す。  
   Object.defineProperty(myXYZ,'replaceView',{value:replaceCenterAndDirection});
   Object.defineProperty(myXYZ,'replaceViewNotTranslated',{value:replaceCenterAndDirectionNotTranslated});
   Object.defineProperty(myXYZ,'replaceViewNotRotated',{value:replaceCenterAndDirectionNotRotated});
   Object.defineProperty(myXYZ,'replaceOrigin',{value:replaceCenterToOriginOf});
   Object.defineProperty(myXYZ,'none' ,{value:doNothing,enumerable:true});
   Object.defineProperty(myXYZ,'random' ,{value:random,enumerable:true});//paste randome place in space
   Object.defineProperty(myXYZ,'axisY' ,{value:axisY,writable:false,enumerable:true});
   Object.defineProperty(myXYZ,'trans',{value:translateMember,enumerable:true});
   Object.defineProperty(myXYZ,'translate',{value:translateArbitraryQuantity,enumerable:true});
   Object.defineProperty(myXYZ,'rotate',{value:rotate,writable:false,enumerable:true});
   Object.defineProperty(myXYZ,'rotation',{value:rotation,writable:false,enumerable:true});
   Object.defineProperty(myXYZ,'gotoOrigin',{value:gotoOrigin,writable:false,enumerable:true});
   Object.defineProperty(myXYZGravity,'reposAll',{value:repositionAll});
   Object.defineProperty(myXYZMani,'move',{value:move(hero)});
   Object.defineProperty(myXYZMani,'accordingToKeyFlame',{value:accordingToKeyFlame});
   Object.defineProperty(myXYZRevolutions,'reposAll',{value:repositionizeAllMembers(),writable:false,enumerable:false,configurable:false});
   上記の1～4のマトリックスはoMatricesオブジェクトのプロパティーとして配列で計算の順番にしまわれる。  
   その例を以下に示す。  
        var m1 = myXYZ.rotate(1,0,0,90);
        var m2 = myXYZ.rotation(0,1,0,myFacts.planets[name].rotationHour,0);
        var m3 = myXYZ.trans(xyz[name]);
        var m4 = myXYZ.replaceView(xyz[namePlane]);
        var m5 = myXYZ.translate(0,0,-_frontLength_);
        var m6 = myXYZ.gotoOrigin();
        var oMatrices = {
                modelView:[m1,m2,m3,m4,m5],                             //all matrices
                manipulatedRotation:[m6],                               //rotation matrices in manipulated matrices
                manipulated:[m4],                       //all manipulated matrices
                notManipulated:[m1,m2,m3]               //not manipulated matrices
        };
	これらm1～m6は、時間の関数であったり、静的だったりする。たとえば、myXYZ.rotation(0,1,0,角速度,0)の返す値は、
                return function(timeTotal_minute){
                        //model view matrix...myMat4 was already defined in global scope
                        myMat4.rot(rx,ry,rz,ratio * timeTotal_minute + rad0);
                }
	となっていて、これは、経過時間の関数である。myXYZ.rotationは計算のためのパラメータをあたえている。
	関数の中にはmyMat4.rot()があり、matrixに回転を加えている。
	つまり、m2の存在するmodelView matrixとnotManipulated matrixがその影響を受ける。

   ####oValuesForShaderオブジェクト : shaderに渡すパラメータの値を指定する   
   ------------------------------------------------------------------------  
   
   例を示して説明する  
           var oValuesForShader = {
                name:name,
                brightness:1.1,         //reflection of Sun light光が当たっている時の明るさ
                alpha:1.,               //alpha透明度
                baseLight:1.,           //emmision自らの輝き
                cassiniFactor:0.,       //whether ring or notカッシーニの隙間の処理に使われる
        };
  これらの値は計算するときにshaderプログラムに渡される。

   shapeオブジェクト : 形を決める。ここでは基本的な形しか用意していないが、もちろん拡張は可能。    
   ---------------------------------------------------------------------------------------------  
  shape変数に、myShapeオブジェクトの中から形を選ぶ  
  形の一覧を示す  
Object.defineProperty(myShape,'flame',{value:flame,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'lines',{value:lines,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'point' ,{value:point,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'line' ,{value:line,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'triangle' ,{value:triangle,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'cylindricalCalumn' ,{value:cylindricalCalumn,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'rectangle' ,{value:rectangle,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'axisX' ,{value:axisX,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'axisY' ,{value:new axisY,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'axisZ' ,{value:new axisZ,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'tetra' ,{value:tetrahedron,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'hexa' ,{value:hexahedron,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'sphere' ,{value:sphere2,writable:false,enumerable:true,configurable:false});
Object.defineProperty(myShape,'ring' ,{value:ringPlane,writable:false,enumerable:true,configurable:false});
  

   ###UnitsToDrawオブジェクトの作成  
   --------------------------------  
   UnitsToDraw.join()で、計算の仲間に入れてもらえる。具体的には次のようにする。  
   UnitsToDraw.join(gl,name,name,shape,oMatrices,oValuesForShader);
   nameはString  
   glはCanvasのWebGLコンテキスト。  


  ##drawScene()の実行  
  -------------------  
  この関数部分が、やたら長いが、土星とそのリングといくつかの衛星の影の処理に大半を費やしている。  


  ###


   buffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER,buffer); //つくったbufferをバインド
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape.pos),gl.STATIC_DRAW); //shape.posはArrayなのでこうやってbufferにデータを格納
   ちなみに、INDEXはさらに、使用する直前にgl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffIndex)しないといけない。



