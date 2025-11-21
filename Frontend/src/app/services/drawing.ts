import { Injectable } from '@angular/core';
import { Shape } from '../models/shape';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  private ctx!: CanvasRenderingContext2D;

  setContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  draw(shape: Shape) {
    if (!this.ctx) return;

    const { type, x1, y1, x2, y2, properties } = shape;

    const strokeWidth = properties['strokeWidth'] ?? 2;
    const strokeColor = properties['strokeColor'] ?? '#000000';
    const fillColor = properties['fillColor'] ?? 'transparent';
    const opacity = properties['opacity'] ?? 1;
    const lineStyle = properties['lineStyle'] ?? 'solid';

    this.ctx.lineWidth = strokeWidth;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.globalAlpha = opacity;

    if (lineStyle === 'dashed') {
      this.ctx.setLineDash([10, 10]);
    } else {
      this.ctx.setLineDash([]);
    }

    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    const drawX = Math.min(x1, x2);
    const drawY = Math.min(y1, y2);

    this.ctx.beginPath();

    switch (type) {
      case 'rectangle':
        this.ctx.rect(drawX, drawY, width, height);
        break;

      case 'square': {
        const side = Math.min(width, height);
        this.ctx.rect(drawX, drawY, side, side);
        break;
      }

      case 'circle': {
        const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        this.ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        break;
      }

      case 'ellipse': {
        this.ctx.ellipse(
          drawX + width / 2,
          drawY + height / 2,
          width / 2,
          height / 2,
          0,
          0,
          Math.PI * 2
        );
        break;
      }

      case 'line':
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        break;

      case 'triangle':
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y1);
        this.ctx.lineTo(drawX, y2);
        this.ctx.closePath();
        break;

      case 'freehand': {
        const points: any[] = properties['points'] ?? [];
        if (points.length > 1) {
          this.ctx.moveTo(points[0].x, points[0].y);
          points.forEach((p) => this.ctx.lineTo(p.x, p.y));
        }
        break;
      }
    }

    if (fillColor !== 'transparent') {
      this.ctx.fill();
    }
    this.ctx.stroke();
  }
}
