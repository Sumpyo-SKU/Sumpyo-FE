import styled, { css } from 'styled-components'

const Card = styled.section`
  position: relative;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.65);

  ${({ $variant }) =>
    $variant === 'metric' &&
    css`
      display: flex;
      align-items: center;
      height: 111px;
      border-width: 1px;
      border-radius: 22px;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(12px);
      box-shadow: -8px 8px 32px rgba(60, 80, 160, 0.05);
    `}

  ${({ $variant }) =>
    $variant === 'outdoor' &&
    css`
      display: flex;
      align-items: center;
      gap: 8px;
      height: 64px;
      padding: 0 12px 0 13px;
      border-width: 0.561px;
      border-radius: 12.352px;
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(6.737px);
      box-shadow:
        -4.492px 4.492px 17.966px rgba(60, 80, 160, 0.08),
        inset 0 0.561px 0 rgba(255, 255, 255, 0.95);
    `}
`

export default Card
