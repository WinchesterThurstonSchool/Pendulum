import THREE = require('three');

//The class that converts virtual coordinate system to its graphics presentation
class Locator {
    //Graphics units per virtual unit
    unitRatio = 1.5;
    scalex = 1;
    scaley = 1;
    deltax = 1;
    deltay = 1;
    deltaX = 0;
    deltaY = 0;
    
    public X(vertex: number[]) {
        //  return width / 2 + (int)((x + deltax) * dpi * scalex) + deltaX;
    }
    // public int X(float x, float y) {
    //     return width / 2 + (int)((x + deltax) * dpi * scalex) + deltaX;
    // }
    // public int Y(float[] vertex) {
    //     return Y(vertex[0], vertex[1]);
    // }
    // public int Y(float x, float y) {
    //     return height / 2 - (int)((y + deltay) * scaley * dpi) - deltaY;
    // }
    // public int Width(float width) {
    //     return X(width, 0) - X(0, 0);
    // }
    // public int Height(float height) {
    //     return Y(0, height) - Y(0, 0);
    // }
    // public float x(int X, int Y) {
    //     return (float)(X - deltaX - width / 2) / dpi / scalex - deltax;
    // }
    // public float y(int X, int Y) {
    //     return (float)(-Y - deltaY + height / 2) / dpi / scaley - deltay;
    // }
    // public float width(int Width) {
    //     return X(Width, 0) - X(0, 0);
    // }
    // public float height(int Height) {
    //     return y(0, Height) - Y(0, 0);
    // }

    // //Pinned zooming
    // public void zoom(int pinX, int pinY, float factorx, float factory) {
    //     float pinx = x(pinX, pinY);
    //     float piny = y(pinX, pinY);
    //     scalex *= factorx;
    //     scaley *= factory;
    //     deltax = (pinx + deltax) / factorx - pinx;
    //     deltay = (piny + deltay) / factory - piny;
    // }
}

let lc:Locator = new Locator();
lc.X(12,12,11);

module.exports = Locator;