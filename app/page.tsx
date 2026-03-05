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
import { Mic } from 'lucide-react'
import BreakEvenChart from '@/components/BreakEvenChart'
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'

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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isApplyingExample, setIsApplyingExample] = useState(false)
  const [needsManualConfirm, setNeedsManualConfirm] = useState(false)

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

  const breakEvenVolume = grossMargin > 0 ? fixedCostPerMonth / grossMargin : 0
  const breakEvenVolumeRounded = breakEvenVolume > 0 ? Math.ceil(breakEvenVolume) : 0
  const breakEvenRevenue =
    breakEvenVolumeRounded > 0 ? Math.round(breakEvenVolumeRounded * unitPriceNum) : 0

  const fmtN = (n: number) => Math.round(n).toLocaleString()

  const sampleCaseText =
    '我經營手作便當店，每份售價 180 元，每份食材與包材等變動成本約 95 元，每月固定成本約 32,000 元，目前每月大約賣 120 份。'

  const applySampleData = () => {
    setUnitPrice('180')
    setMonthlyVolume('120')

    setVarRawMaterial('75')
    setVarPackaging('12')
    setVarSupplies('5')
    setVarShipping('3')
    setVarOther('0')

    setFixRent('20000')
    setFixStaff('8000')
    setFixWater('2500')
    setFixGas('500')
    setFixComm('700')
    setFixLoan('0')
    setFixOther('300')
  }

  const goToResultsTop = () => {
    setNeedsManualConfirm(false)
    setCurrentStep('results')
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }

  // Mock AI extraction (when user submits)
  const handleAIExtract = () => {
    setAiInput(sampleCaseText)
    applySampleData()
    setNeedsManualConfirm(true)
    setCurrentStep('manual')
  }

  const handleLoadExample = () => {
    setIsApplyingExample(true)
    window.setTimeout(() => {
      setAiInput(sampleCaseText)
      applySampleData()
      goToResultsTop()
      setIsApplyingExample(false)
    }, 180)
  }

  // Handle recording button (simulation)
  const handleRecord = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
    }, 2000)
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    try {
      const breakEvenVolumeNum = grossMargin > 0 ? Math.ceil(breakEvenVolume) : 0
      const currentVolumeNum = Math.max(0, Math.round(volumeNum))
      const currentRevenue = unitPriceNum * currentVolumeNum
      const currentTotalCost = fixedCostPerMonth + varCostPerUnit * currentVolumeNum
      const currentProfit = currentRevenue - currentTotalCost
      const diffToBreakEven = breakEvenVolumeNum - currentVolumeNum

      const conclusion =
        breakEvenVolumeNum <= 0
          ? '目前資料不足以計算損益平衡點，請確認每件售價與成本設定。'
          : diffToBreakEven > 0
            ? `目前銷量仍低於損益平衡點，仍需增加 ${diffToBreakEven} 件才能達到不虧不賠。`
            : diffToBreakEven < 0
              ? `目前銷量已超過損益平衡點 ${Math.abs(diffToBreakEven)} 件，已進入盈利區。`
              : '目前銷量剛好達到損益平衡點，已達不虧不賠。'

      const formatMoney = (value: number) => `${Math.round(value).toLocaleString()} 元`
      const formatCount = (value: number) => `${Math.round(value).toLocaleString()} 件`

      const today = new Date()
      const pad = (value: number) => String(value).padStart(2, '0')
      const reportDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
      const fileDate = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`

      const sampleVolumes = Array.from(
        new Set([
          0,
          Math.max(1, Math.round(currentVolumeNum * 0.5)),
          currentVolumeNum,
          breakEvenVolumeNum,
          breakEvenVolumeNum > 0 ? Math.round(breakEvenVolumeNum * 1.25) : 0,
        ])
      )
        .filter((volume) => volume >= 0)
        .sort((a, b) => a - b)

      const buildCell = (text: string, isHeader = false) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text, bold: isHeader })],
            }),
          ],
        })

      const summaryTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              buildCell('項目', true),
              buildCell('數值', true),
            ],
          }),
          new TableRow({
            children: [buildCell('每件售價'), buildCell(formatMoney(unitPriceNum))],
          }),
          new TableRow({
            children: [buildCell('每件變動成本'), buildCell(formatMoney(varCostPerUnit))],
          }),
          new TableRow({
            children: [buildCell('每月固定成本'), buildCell(formatMoney(fixedCostPerMonth))],
          }),
          new TableRow({
            children: [buildCell('每月銷量'), buildCell(formatCount(currentVolumeNum))],
          }),
        ],
      })

      const kpiTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              buildCell('指標', true),
              buildCell('結果', true),
            ],
          }),
          new TableRow({
            children: [buildCell('毛利（每件）'), buildCell(formatMoney(grossMargin))],
          }),
          new TableRow({
            children: [buildCell('毛利率'), buildCell(`${grossMarginRate.toFixed(1)}%`)],
          }),
          new TableRow({
            children: [buildCell('損益平衡點銷量'), buildCell(formatCount(breakEvenVolumeNum))],
          }),
          new TableRow({
            children: [buildCell('損益平衡點營業收入'), buildCell(formatMoney(breakEvenRevenue))],
          }),
        ],
      })

      const chartTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              buildCell('每月銷量（件）', true),
              buildCell('營業收入', true),
              buildCell('總成本', true),
              buildCell('損益', true),
            ],
          }),
          ...sampleVolumes.map((volume) => {
            const revenue = unitPriceNum * volume
            const totalCost = fixedCostPerMonth + varCostPerUnit * volume
            const profit = revenue - totalCost

            return new TableRow({
              children: [
                buildCell(formatCount(volume)),
                buildCell(formatMoney(revenue)),
                buildCell(formatMoney(totalCost)),
                buildCell(formatMoney(profit)),
              ],
            })
          }),
        ],
      })

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                text: '損益平衡試算報表',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                text: `產出日期：${reportDate}`,
                alignment: AlignmentType.RIGHT,
                spacing: { after: 240 },
              }),
              new Paragraph({
                text: '你填的數字摘要',
                heading: HeadingLevel.HEADING_1,
              }),
              summaryTable,
              new Paragraph({ text: '' }),
              new Paragraph({
                text: '關鍵指標',
                heading: HeadingLevel.HEADING_1,
              }),
              kpiTable,
              new Paragraph({ text: '' }),
              new Paragraph({
                text: '成本與利潤流動關係',
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({ text: '• 營業收入：每件售價 × 每月銷量' }),
              new Paragraph({ text: '• 扣掉變動成本後，得到每件毛利' }),
              new Paragraph({ text: '• 用毛利承擔每月固定成本' }),
              new Paragraph({ text: '• 達到損益平衡點後，會開始進入盈利' }),
              new Paragraph({ text: '' }),
              new Paragraph({
                text: '損益平衡分析圖',
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({ text: `營業收入線：${formatMoney(unitPriceNum)} × 每月銷量` }),
              new Paragraph({
                text: `總成本線：${formatMoney(fixedCostPerMonth)} + ${formatMoney(varCostPerUnit)} × 每月銷量`,
              }),
              new Paragraph({
                text: `損益平衡點：${formatCount(breakEvenVolumeNum)}（對應營業收入約 ${formatMoney(
                  breakEvenRevenue
                )}）`,
              }),
              new Paragraph({ text: `目前銷量：${formatCount(currentVolumeNum)}` }),
              new Paragraph({ text: `目前營業收入：${formatMoney(currentRevenue)}` }),
              new Paragraph({ text: `目前總成本：${formatMoney(currentTotalCost)}` }),
              new Paragraph({ text: `目前損益：${formatMoney(currentProfit)}` }),
              new Paragraph({ text: `結論：${conclusion}`, spacing: { after: 200 } }),
              new Paragraph({
                text: '分析圖資料（節錄）',
                heading: HeadingLevel.HEADING_2,
              }),
              chartTable,
            ],
          },
        ],
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `損益平衡分析報表_${fileDate}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('產出報表失敗', error)
      window.alert('產出報表失敗，請稍後再試。')
    } finally {
      setIsGeneratingReport(false)
    }
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
                <CardTitle className="text-xl text-blue-900">步驟 1：用一段話描述你的生意狀況</CardTitle>
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
                    variant="secondary"
                    className="text-gray-700 transition-transform duration-150 active:scale-95 active:shadow-inner"
                    onClick={handleLoadExample}
                    disabled={isApplyingExample}
                  >
                    {isApplyingExample ? '載入案例中...' : '參考案例'}
                  </Button>
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
                onClick={() => {
                  setNeedsManualConfirm(false)
                  setCurrentStep('manual')
                }}
                className="bg-gray-900 hover:bg-gray-800"
              >
                開始手動輸入
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'manual' && (
          <div className="space-y-6">
            {needsManualConfirm && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertDescription className="text-amber-800">
                  已幫你整理好初步數字，請先確認內容，再按下「開始試算」查看結果。
                </AlertDescription>
              </Alert>
            )}

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
                            {fmtN(varCostPerUnit)}
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
                            {fmtN(fixedCostPerMonth)}
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
                onClick={goToResultsTop}
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
                    <p className="text-xl font-bold text-blue-600">${fmtN(unitPriceNum)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-gray-600">每件變動成本</p>
                    <p className="text-xl font-bold text-blue-600">${fmtN(varCostPerUnit)}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <p className="text-gray-600">每月固定成本</p>
                    <p className="text-xl font-bold text-blue-600">${fmtN(fixedCostPerMonth)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard
                title="毛利（每件）"
                value={`$${fmtN(grossMargin)}`}
                formula="算法：每件售價－每件變動成本"
                usage="用途：用來看『賣一件可以賺多少錢』，是定價與控成本的第一步。"
              />
              <KPICard
                title="毛利率"
                value={`${grossMarginRate.toFixed(1)}%`}
                formula="算法：毛利 ÷ 每件售價"
                usage="用途：用來看『收入中有多少比例可以留下來』，越高越能承擔固定成本與波動。"
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
                <BreakEvenChart
                  unitPrice={unitPriceNum}
                  varCostPerUnit={varCostPerUnit}
                  fixedCostPerMonth={fixedCostPerMonth}
                  grossMargin={grossMargin}
                  breakEvenVolume={breakEvenVolume}
                  currentVolume={volumeNum}
                />
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
                    onClick={() => {
                      setNeedsManualConfirm(false)
                      setCurrentStep('manual')
                    }}
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
                    onClick={handleGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? '產出中...' : '產出報表'}
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
            <p className="text-2xl font-bold text-orange-600">${breakEvenRevenue.toLocaleString()}</p>
          </div>
          <Separator className="bg-orange-200" />
          <div>
            <p className="text-xs text-gray-600 mb-1">需要的每月銷量（件）</p>
            <p className="text-2xl font-bold text-orange-600">{Math.ceil(breakEvenVolume).toLocaleString()}</p>
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
