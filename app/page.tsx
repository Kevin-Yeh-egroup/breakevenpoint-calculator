'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Mic, Check } from 'lucide-react'

const BreakEvenCalculator = () => {
  // Main inputs
  const [unitPrice, setUnitPrice] = useState('')
  const [monthlyVolume, setMonthlyVolume] = useState('')

  // Variable costs per unit
  const [varRawMaterial, setVarRawMaterial] = useState('')
  const [varPackaging, setVarPackaging] = useState('')
  const [varSupplies, setVarSupplies] = useState('')
  const [varShipping, setVarShipping] = useState('')
  const [varOther, setVarOther] = useState('')

  // Fixed costs per month
  const [fixRent, setFixRent] = useState('')
  const [fixStaff, setFixStaff] = useState('')
  const [fixWater, setFixWater] = useState('')
  const [fixGas, setFixGas] = useState('')
  const [fixComm, setFixComm] = useState('')
  const [fixLoan, setFixLoan] = useState('')
  const [fixOther, setFixOther] = useState('')

  // Display states
  const [currentStep, setCurrentStep] = useState<'ai' | 'manual' | 'results'>('ai')
  const [showExamples, setShowExamples] = useState(true)
  const [aiInput, setAiInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  // Calculate derived values
  const unitPriceNum = parseFloat(unitPrice) || 0
  const volumeNum = parseFloat(monthlyVolume) || 0

  const varCostPerUnit =
    (parseFloat(varRawMaterial) || 0) +
    (parseFloat(varPackaging) || 0) +
    (parseFloat(varSupplies) || 0) +
    (parseFloat(varShipping) || 0) +
    (parseFloat(varOther) || 0)

  const grossMargin = unitPriceNum - varCostPerUnit
  const grossMarginRate = unitPriceNum > 0 ? (grossMargin / unitPriceNum) * 100 : 0

  const fixedCostPerMonth =
    (parseFloat(fixRent) || 0) +
    (parseFloat(fixStaff) || 0) +
    (parseFloat(fixWater) || 0) +
    (parseFloat(fixGas) || 0) +
    (parseFloat(fixComm) || 0) +
    (parseFloat(fixLoan) || 0) +
    (parseFloat(fixOther) || 0)

  const breakEvenRevenue = grossMarginRate > 0 ? fixedCostPerMonth / (grossMarginRate / 100) : 0
  const breakEvenVolume = grossMargin > 0 ? fixedCostPerMonth / grossMargin : 0

  // Mock AI extraction (when user submits)
  const handleAIExtract = () => {
    // Simulate AI extraction with mock values for demo
    setUnitPrice('250')
    setVarRawMaterial('60')
    setMonthlyVolume('180')
    setFixRent('12000')
    setFixWater('3000')
    setCurrentStep('manual')
  }

  // Handle recording button (simulation)
  const handleRecord = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
    }, 2000)
  }

  // Calculate chart data
  const chartData = []
  for (let i = 0; i <= Math.ceil(breakEvenVolume) + 50; i += Math.max(1, Math.ceil(breakEvenVolume / 10))) {
    const revenue = i * unitPriceNum
    const totalCost = i * varCostPerUnit + fixedCostPerMonth
    const profit = revenue - totalCost
    chartData.push({
      銷量: i,
      營業額: Math.round(revenue),
      總成本: Math.round(totalCost),
      利潤: Math.round(profit),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">損益平衡計算小工具</h1>
          <p className="text-gray-600">幫助您輕鬆了解毛利、毛利率和損益平衡點</p>
        </div>

        {/* Main Content */}
        {currentStep === 'ai' && (
          <div className="space-y-6">
            {/* AI Assistant Section */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">步驟 1：用一句話描述你的生意狀況</CardTitle>
                <p className="text-sm text-blue-700 mt-2">
                  你可以用語音或直接打字描述，我們會幫你把需要的數字整理出來（此為示意功能）。
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="例：我賣手作蛋糕，一個 250 元，材料大約 60 元。店租每月 12,000 元，水電約 3,000 元。每月大概賣 180 個。"
                  className="min-h-24"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={handleRecord}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? '已開始錄音（示意）' : '語音輸入（示意）'}
                  </Button>
                  <Button
                    onClick={handleAIExtract}
                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                  >
                    整理重點（示意）
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Input Prompt */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">或直接進行手動輸入</p>
              <Button
                onClick={() => setCurrentStep('manual')}
                className="bg-gray-900 hover:bg-gray-800"
              >
                開始手動輸入
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'manual' && (
          <div className="space-y-6">
            {/* Step 1: Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">步驟 1：商品／服務與銷量</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    每件售價（元）
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">你賣一個商品或服務的價格</p>
                  <p className="text-xs text-gray-400">沒有就填 0</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    每月銷量（件）
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-xs text-gray-500">平均一個月大概賣多少</p>
                  <p className="text-xs text-gray-400">沒有就填 0</p>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Variable & Fixed Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">步驟 2：成本結構</CardTitle>
                <div className="flex items-center gap-2 mt-3">
                  <Switch
                    checked={showExamples}
                    onCheckedChange={setShowExamples}
                  />
                  <span className="text-sm text-gray-600">顯示例子與說明</span>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="variable" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="variable">變動成本</TabsTrigger>
                    <TabsTrigger value="fixed">固定成本</TabsTrigger>
                  </TabsList>

                  <TabsContent value="variable" className="space-y-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <AlertDescription className="text-blue-800">
                        變動成本是：賣越多、用越多的成本。沒有就填 0。
                      </AlertDescription>
                    </Alert>

                    <VariableCostCard
                      title="原料"
                      helper={showExamples ? '例：咖啡豆、食材、材料、批貨成本' : ''}
                      value={varRawMaterial}
                      onChange={setVarRawMaterial}
                      label="每件原料成本（元）"
                    />
                    <VariableCostCard
                      title="包材"
                      helper={showExamples ? '例：塑膠袋、外帶盒、貼紙、標籤' : ''}
                      value={varPackaging}
                      onChange={setVarPackaging}
                      label="每件包材成本（元）"
                    />
                    <VariableCostCard
                      title="耗材"
                      helper={showExamples ? '例：清潔用品、文具、收據' : ''}
                      value={varSupplies}
                      onChange={setVarSupplies}
                      label="每件耗材成本（元）"
                    />
                    <VariableCostCard
                      title="運費"
                      helper={showExamples ? '例：宅配、郵資、快遞' : ''}
                      value={varShipping}
                      onChange={setVarShipping}
                      label="每件運費（元）"
                    />
                    <VariableCostCard
                      title="變動其他"
                      helper={showExamples ? '例：加油、擺攤交通、工讀生（若與銷量直接相關）' : ''}
                      value={varOther}
                      onChange={setVarOther}
                      label="每件其他變動成本（元）"
                    />

                    <Card className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">每件變動成本小計（元）</span>
                          <span className="text-lg font-bold text-blue-600">
                            {varCostPerUnit.toFixed(0)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="fixed" className="space-y-4">
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        固定成本是：不管有沒有賣出，每月都會出現的支出。沒有就填 0。
                      </AlertDescription>
                    </Alert>

                    <FixedCostCard
                      title="租金"
                      helper={showExamples ? '例：店租、擺攤租金' : ''}
                      value={fixRent}
                      onChange={setFixRent}
                      label="每月租金（元）"
                    />
                    <FixedCostCard
                      title="人事"
                      helper={showExamples ? '例：會計師、助理、工會相關費用' : ''}
                      value={fixStaff}
                      onChange={setFixStaff}
                      label="每月人事費（元）"
                    />
                    <FixedCostCard
                      title="水電瓦斯"
                      helper={showExamples ? '例：營業用水電、天然氣、瓦斯' : ''}
                      value={fixWater}
                      onChange={setFixWater}
                      label="每月水電（元）"
                      subLabel="每月瓦斯（元）"
                      subValue={fixGas}
                      onSubChange={setFixGas}
                    />
                    <FixedCostCard
                      title="通訊"
                      helper={showExamples ? '例：店內電話、網路費' : ''}
                      value={fixComm}
                      onChange={setFixComm}
                      label="每月通訊網路（元）"
                    />
                    <FixedCostCard
                      title="還款"
                      helper={showExamples ? '例：創業貸款、進貨貸款、分期' : ''}
                      value={fixLoan}
                      onChange={setFixLoan}
                      label="每月還款（元）"
                    />
                    <FixedCostCard
                      title="固定其他"
                      helper={showExamples ? '例：營業稅、會計費' : ''}
                      value={fixOther}
                      onChange={setFixOther}
                      label="每月固定其他（元）"
                    />

                    <Card className="bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">每月固定成本小計（元）</span>
                          <span className="text-lg font-bold text-green-600">
                            {fixedCostPerMonth.toFixed(0)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentStep('results')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
              >
                開始試算
              </Button>
              <Button
                onClick={() => {
                  setUnitPrice('')
                  setMonthlyVolume('')
                  setVarRawMaterial('')
                  setVarPackaging('')
                  setVarSupplies('')
                  setVarShipping('')
                  setVarOther('')
                  setFixRent('')
                  setFixStaff('')
                  setFixWater('')
                  setFixGas('')
                  setFixComm('')
                  setFixLoan('')
                  setFixOther('')
                }}
                variant="outline"
                className="flex-1 py-6 text-base"
              >
                清除重填
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle>你填的數字摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-gray-600">每件售價</p>
                    <p className="text-xl font-bold text-blue-600">${unitPriceNum.toFixed(0)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-gray-600">每件變動成本</p>
                    <p className="text-xl font-bold text-blue-600">${varCostPerUnit.toFixed(0)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-gray-600">每月固定成本</p>
                    <p className="text-xl font-bold text-blue-600">${fixedCostPerMonth.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="毛利（每件）"
                value={`$${grossMargin.toFixed(0)}`}
                formula="算法：每件售價－每件變動成本"
                usage="用途：用來看『賣一件到底剩多少』，是定價與控成本的第一步。"
              />
              <KPICard
                title="毛利率"
                value={`${grossMarginRate.toFixed(1)}%`}
                formula="算法：毛利 ÷ 每件售價"
                usage="用途：用來看『每賣 100 元，能留下多少』，越高越能承擔固定成本與波動。"
              />
              <KPICard
                title="損益平衡點（每月）"
                value=""
                formula=""
                usage=""
                isBreakEven
                breakEvenRevenue={breakEvenRevenue}
                breakEvenVolume={breakEvenVolume}
              />
            </div>

            {/* Flow Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>成本與利潤流動關係</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">營業額</Badge>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">扣掉變動成本</span>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">毛利</Badge>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">用毛利承擔固定成本</span>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-600">達到損益平衡點</Badge>
                    <div className="flex-1 h-1 bg-gray-300"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <Card>
              <CardHeader>
                <CardTitle>損益平衡分析圖</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="銷量" label={{ value: '每月銷量（件）', position: 'insideBottomRight', offset: -5 }} />
                    <YAxis label={{ value: '金額（元）', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      formatter={(value) => `$${value}`}
                      labelStyle={{ color: '#000' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="營業額" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="總成本" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Understanding Results */}
            <Card>
              <CardHeader>
                <CardTitle>看懂結果</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>毛利變高會怎樣？</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p className="text-sm">• 代表每賣一件，你能留下更多錢</p>
                      <p className="text-sm">• 更容易達到損益平衡點，需要賣的件數變少</p>
                      <p className="text-sm">• 可以更快地覆蓋固定成本，開始獲利</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>毛利率變高會怎樣？</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p className="text-sm">• 代表每 100 元的營業額中，你能留下更多</p>
                      <p className="text-sm">• 對抗市場波動和成本變化的能力更強</p>
                      <p className="text-sm">• 即使銷量下降，也能維持更好的利潤</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>固定成本變高會怎樣？</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      <p className="text-sm">• 代表你需要更多的毛利來覆蓋這些成本</p>
                      <p className="text-sm">• 損益平衡點會上升，需要賣更多才能不虧</p>
                      <p className="text-sm">• 經營風險變高，更需要穩定的銷量</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>下一步</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  這是試算工具，結果僅供你做初步判斷；若要做更完整規劃，建議再把實際帳務資料補齊。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => setCurrentStep('manual')}
                  >
                    我想調整數字試試看
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => setCurrentStep('ai')}
                  >
                    回到開始
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 h-12"
                    onClick={() => {
                      const text = `
損益平衡計算結果：
毛利（每件）：$${grossMargin.toFixed(0)}
毛利率：${grossMarginRate.toFixed(1)}%
損益平衡點營業額：$${breakEvenRevenue.toFixed(0)}
損益平衡點銷量：${Math.ceil(breakEvenVolume)}件
                      `
                      navigator.clipboard.writeText(text)
                    }}
                  >
                    複製結果
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function VariableCostCard({ title, helper, value, onChange, label }) {
  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-gray-400">沒有就填 0</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FixedCostCard({ title, helper, value, onChange, label, subLabel, subValue, onSubChange }) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <Input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="text-base"
            />
            <p className="text-xs text-gray-400">沒有就填 0</p>
          </div>
          {subLabel && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{subLabel}</label>
              <Input
                type="number"
                placeholder="0"
                value={subValue}
                onChange={(e) => onSubChange(e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-gray-400">沒有就填 0</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function KPICard({ title, value, formula, usage, isBreakEven, breakEvenRevenue, breakEvenVolume }) {
  if (isBreakEven) {
    return (
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">需要的每月營業額（元）</p>
            <p className="text-2xl font-bold text-orange-600">${breakEvenRevenue.toFixed(0)}</p>
          </div>
          <Separator className="bg-orange-200" />
          <div>
            <p className="text-xs text-gray-600 mb-1">需要的每月銷量（件）</p>
            <p className="text-2xl font-bold text-orange-600">{Math.ceil(breakEvenVolume)}</p>
          </div>
          <Separator className="bg-orange-100 my-2" />
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">算法（營業額）：</p>
            <p className="text-xs text-gray-600">每月固定成本 ÷ 毛利率</p>
            <p className="text-xs font-semibold text-gray-700 mt-2">算法（銷量）：</p>
            <p className="text-xs text-gray-600">每月固定成本 ÷ 毛利</p>
          </div>
          <Separator className="bg-orange-100 my-2" />
          <p className="text-xs text-gray-700">
            <span className="font-semibold">用途：</span>用來看『至少要做到哪裡才不會賠』，可用於設定每月目標。
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-3xl font-bold text-blue-600">{value}</p>
        <Separator className="bg-blue-100" />
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-700">{formula}</p>
          <p className="text-xs text-gray-700">{usage}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BreakEvenCalculator
