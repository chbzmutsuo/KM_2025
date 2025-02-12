import QRCode from 'qrcode.react'

function QRCodeComponent(props: {url: string; style?: React.CSSProperties}) {
  const {url, style} = props
  return <QRCode value={url} style={{textAlign: 'center', margin: 'auto', ...style}} />
}

export default QRCodeComponent
