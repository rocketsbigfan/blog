import '../../styles/global.css'

export default function RootLayout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  const { children, modal } = props
  return (
    <>
      {/* 主要内容区域 */}
      {children}
      {/* 弹窗内容区域，用于显示模态框 */}
      {modal}
    </>
  )
}