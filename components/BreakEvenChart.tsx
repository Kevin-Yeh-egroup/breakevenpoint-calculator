'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceLine,
  ReferenceDot,
  Label,
} from 'recharts'

interface BreakEvenChartProps {
  unitPrice: number
  varCostPerUnit: number
  fixedCostPerMonth: number
  grossMargin: number
  breakEvenVolume: number
  currentVolume: number
}

function BreakEvenDotShape({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={28} fill="#F97316" fillOpacity={0.08} />
      <circle cx={cx} cy={cy} r={20} fill="#F97316" fillOpacity={0.18} />
      <circle cx={cx} cy={cy} r={13} fill="#F97316" stroke="#C2410C" strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={6} fill="white" />
    </g>
  )
}

function BreakEvenLabelContent({
  viewBox,
  bev,
}: {
  viewBox?: { x: number; y: number }
  bev: number
}) {
  if (!viewBox) return null
  const { x, y } = viewBox
  return (
    <g>
      <rect
        x={x + 18}
        y={y - 28}
        width={148}
        height={36}
        rx={6}
        fill="white"
        stroke="#F97316"
        strokeWidth={1.5}
        filter="drop-shadow(0 1px 4px rgba(0,0,0,0.12))"
      />
      <text
        x={x + 26}
        y={y - 13}
        fill="#C2410C"
        fontSize={12}
        fontWeight="bold"
        textAnchor="start"
      >
        損益平衡點
      </text>
      <text x={x + 26} y={y + 2} fill="#EA580C" fontSize={11} textAnchor="start">
        每月需要銷量：{bev} 件
      </text>
    </g>
  )
}

export default function BreakEvenChart({
  unitPrice,
  varCostPerUnit,
  fixedCostPerMonth,
  grossMargin,
  breakEvenVolume,
  currentVolume: initialCurrentVolume,
}: BreakEvenChartProps) {
  const bev =
    grossMargin > 0 && isFinite(breakEvenVolume) && breakEvenVolume > 0
      ? Math.ceil(breakEvenVolume)
      : 0

  const maxX = useMemo(() => {
    const base = Math.max(
      bev > 0 ? bev * 1.75 : 50,
      initialCurrentVolume > 0 ? initialCurrentVolume * 1.5 : 30,
      50
    )
    return Math.ceil(base / 10) * 10
  }, [bev, initialCurrentVolume])

  const [sliderVolume, setSliderVolume] = useState(() =>
    Math.min(
      initialCurrentVolume > 0 ? initialCurrentVolume : bev > 0 ? Math.floor(bev * 0.75) : 20,
      maxX
    )
  )

  const chartData = useMemo(() => {
    const numPoints = 60
    return Array.from({ length: numPoints + 1 }, (_, i) => {
      const vol = Math.round((i / numPoints) * maxX)
      return {
        銷量: vol,
        營業收入: Math.round(vol * unitPrice),
        總成本: Math.round(fixedCostPerMonth + varCostPerUnit * vol),
      }
    })
  }, [maxX, unitPrice, varCostPerUnit, fixedCostPerMonth])

  const bevAmount = bev > 0 ? Math.round(bev * unitPrice) : 0
  const bevY = bevAmount
  const zoneHalfWidth = Math.max(maxX * 0.025, 2)
  const bevZoneLeft = bev > 0 ? Math.max(1, bev - zoneHalfWidth) : 0
  const bevZoneRight = bev > 0 ? bev + zoneHalfWidth : 0

  const belowBreakEven = bev > 0 && sliderVolume < bev
  const aboveBreakEven = bev > 0 && sliderVolume > bev
  const diff = bev > 0 ? Math.abs(bev - sliderVolume) : 0

  const formatYAxis = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}萬`
    return `${value}`
  }

  return (
    <div className="space-y-5">
      {/* Chart + Insight panel */}
      <div className="flex gap-4 items-start">
        {/* Chart area */}
        <div className="flex-1 min-w-0">
          <ResponsiveContainer width="100%" height={390}>
            <LineChart data={chartData} margin={{ top: 35, right: 20, left: 15, bottom: 48 }}>
              {/* Background zones */}
              {bev > 0 && bevZoneLeft > 0 && (
                <ReferenceArea x1={0} x2={bevZoneLeft} fill="#FDECEC" fillOpacity={0.85} stroke="none" />
              )}
              {bev > 0 && bevZoneLeft < bevZoneRight && (
                <ReferenceArea
                  x1={bevZoneLeft}
                  x2={bevZoneRight}
                  fill="#FFF6D6"
                  fillOpacity={0.95}
                  stroke="none"
                />
              )}
              {bev > 0 && bevZoneRight < maxX && (
                <ReferenceArea x1={bevZoneRight} x2={maxX} fill="#E9F7EF" fillOpacity={0.85} stroke="none" />
              )}

              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />

              <XAxis
                dataKey="銷量"
                type="number"
                domain={[0, maxX]}
                tickCount={7}
              >
                <Label
                  value="每月銷量（件）"
                  position="insideBottom"
                  offset={-32}
                  style={{ fill: '#6b7280', fontSize: 12 }}
                />
              </XAxis>

              <YAxis tickFormatter={formatYAxis}>
                <Label
                  value="金額（元）"
                  angle={-90}
                  position="insideLeft"
                  offset={12}
                  style={{ fill: '#6b7280', fontSize: 12 }}
                />
              </YAxis>

              <Tooltip
                formatter={(value: number, name: string) => [`${value.toLocaleString()} 元`, name]}
                labelFormatter={(label: number) => `銷量：${label} 件`}
                contentStyle={{ fontSize: 13 }}
              />

              {/* Break-even vertical guide line */}
              {bev > 0 && (
                <ReferenceLine x={bev} stroke="#F97316" strokeDasharray="7 4" strokeWidth={2.5}>
                  <Label
                    value={`${bev} 件`}
                    position="insideBottomRight"
                    style={{ fill: '#C2410C', fontSize: 11, fontWeight: 'bold' }}
                  />
                </ReferenceLine>
              )}

              {/* Current sales vertical guide line */}
              <ReferenceLine
                x={sliderVolume}
                stroke="#6366f1"
                strokeDasharray="5 4"
                strokeWidth={1.5}
              >
                <Label
                  value={`目前銷量：${sliderVolume} 件`}
                  position="insideTopLeft"
                  style={{ fill: '#4338ca', fontSize: 11 }}
                />
              </ReferenceLine>

              {/* Revenue line */}
              <Line
                type="linear"
                dataKey="營業收入"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* Total cost line */}
              <Line
                type="linear"
                dataKey="總成本"
                stroke="#dc2626"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />

              {/* Break-even point marker with label */}
              {bev > 0 && (
                <ReferenceDot
                  x={bev}
                  y={bevY}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  shape={(props: any) => (
                    <BreakEvenDotShape cx={props.cx} cy={props.cy} />
                  )}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  label={(props: any) => (
                    <BreakEvenLabelContent viewBox={props.viewBox} bev={bev} />
                  )}
                />
              )}
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-5 mt-1 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#FDECEC] border border-red-300 inline-block" />
              虧損區
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#FFF6D6] border border-yellow-400 inline-block" />
              損益平衡點
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#E9F7EF] border border-green-400 inline-block" />
              獲利區
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-blue-500 inline-block rounded" />
              營業收入
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-red-500 inline-block rounded" />
              總成本
            </span>
          </div>
        </div>

        {/* Insight panel */}
        <div className="w-52 shrink-0">
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm text-orange-800">分析結果</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3.5">
              <div>
                <p className="text-xs text-gray-500">推估每件毛利</p>
                <p className="text-xl font-bold text-blue-600">{grossMargin.toFixed(0)} 元</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">每月固定成本</p>
                <p className="text-xl font-bold text-gray-700">{fixedCostPerMonth.toLocaleString()} 元</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">損益平衡點營業收入</p>
                <p className="text-xl font-bold text-orange-600">
                  {bev > 0 ? `${bevAmount.toLocaleString()} 元` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">損益平衡銷量</p>
                <p className="text-xl font-bold text-orange-600">{bev > 0 ? `${bev} 件` : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">目前銷量</p>
                <p className="text-xl font-bold text-indigo-600">{sliderVolume} 件</p>
              </div>
              <div className="pt-2.5 border-t border-orange-200">
                {bev === 0 ? (
                  <p className="text-xs text-gray-500 leading-relaxed">
                    請輸入有效的售價、每月銷量與總變動成本資料。
                  </p>
                ) : belowBreakEven ? (
                  <p className="text-xs text-red-700 leading-relaxed">
                    目前銷量仍低於損益平衡點，仍需增加{' '}
                    <span className="font-bold">{diff}</span> 件才能達到不虧不賠。
                  </p>
                ) : aboveBreakEven ? (
                  <p className="text-xs text-green-700 leading-relaxed">
                    目前已超過損益平衡點，多賣了{' '}
                    <span className="font-bold">{diff}</span> 件，持續獲利中！
                  </p>
                ) : (
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    恰好達到損益平衡點，剛好不虧不賠。
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Slider section */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-100">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <label className="text-sm font-semibold text-gray-700">調整每月銷量</label>
          <span
            className={`text-sm font-bold ${
              belowBreakEven ? 'text-red-600' : aboveBreakEven ? 'text-green-600' : 'text-yellow-600'
            }`}
          >
            {sliderVolume} 件
            {bev > 0 &&
              (belowBreakEven
                ? `（距損益平衡還差 ${diff} 件）`
                : aboveBreakEven
                  ? `（已超過損益平衡 ${diff} 件）`
                  : `（剛好達到損益平衡）`)}
          </span>
        </div>
        <Slider
          min={0}
          max={maxX}
          step={1}
          value={[sliderVolume]}
          onValueChange={(v) => setSliderVolume(v[0])}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0 件</span>
          {bev > 0 && (
            <span className="text-orange-500 font-medium">損益平衡點：{bev} 件</span>
          )}
          <span>{maxX} 件</span>
        </div>
      </div>

      {/* Educational callout */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4 px-5">
          <p className="text-sm text-blue-800 leading-relaxed">
            <span className="font-bold">損益平衡點代表：</span>
            <br />
            生意剛好把所有成本補回來的位置。
            <br />
            超過這個位置，每多賣一件都會開始產生獲利。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
