import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { IonIcon } from '@ionic/react'

type Props = { src: string, alt?: string, item: string, onClick: () => void }

const placeholder = '/assets/icons/no-icon.svg'

const wrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  height: 170,
  width: 170,
  padding: 10,
  margin: '0 calc(var(--ion-margin) - 10px)'
}

const iconStyle = {
  height: '100%',
  width: '100%',
  margin: '-5px 25px'
}

const imageStyle: Object = {
  height: '100%',
  width: '100%',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: 'rgba(var(--ion-color-primary-rgb), .1)',
  borderRadius: '50%',
  objectFit: 'contain'
}

const Component: React.FC<Props> = ({ item, src, onClick }) => {
  const selected = false
  const [imageSrc, setImageSrc]: [
    string | undefined, Dispatch<SetStateAction<string | undefined>>
  ] = useState()
  const [imageRef, setImageRef]: [
    Element | undefined, Dispatch<SetStateAction<Element | undefined>>
  ]
    = useState()
  const [observerSet, setObserverSet] = useState(false)
  const [errored, setImageErrored] = useState(false)

  const setRef = (node: any) => {
    setImageRef(node)
  }

  const onError = function () {
    setObserverSet(true)
    setImageErrored(true)
  }

  useEffect(() => {
    let observer: IntersectionObserver
    let didCancel = false

    if (imageRef && observerSet === false) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              // When image is visible in the viewport + rootMargin
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(src)
              }
            })
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        )
        observer.observe(imageRef)
      }
    }

    return () => {
      didCancel = true
      // Remove the listener on unmount
      if (imageRef && observer && observer.unobserve) {
        observer.unobserve(imageRef)
      }
    }
  }, [imageRef, imageSrc, src, observerSet])

  const onClickLocal = (e: any) => {
    e.stopPropagation()
    onClick()
  }

  return <div style={wrapperStyle}>{
    imageSrc
      ? (
        selected
          ? <IonIcon style={iconStyle} ref={setRef} className="ion-icon-primary" icon="/assets/icons/checked.svg" />
          : (
            errored
              ? <IonIcon style={iconStyle} ref={setRef} className="ion-icon-primary" icon={placeholder} />
              : <img onClick={onClickLocal} style={imageStyle} ref={setRef} src={imageSrc} onError={onError} alt="" />
          )
      )
      : <div style={iconStyle} ref={setRef} />
  }</div>

}

export default Component
