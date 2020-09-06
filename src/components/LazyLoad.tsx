import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { IonIcon } from '@ionic/react'

type Props = { src: string, selected: boolean, alt?: string, item: string }

const placeholder = '/assets/icons/no-icon.svg'

const wrapperStyle = {
  height: '100px',
  width: '100px',
  padding: '5px 25px',
  margin: 0
}

const contentStyle = {
  height: '100%',
  width: '100%'
}

const Component: React.FC<Props> = ({ item, src, selected }) => {
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

  return <div style={wrapperStyle}>{
    imageSrc
      ? (
        selected
          ? <IonIcon style={contentStyle} ref={setRef} src={placeholder} />
          : (
            errored
              ? <IonIcon style={contentStyle} ref={setRef} src={placeholder} />
              : <img style={contentStyle} ref={setRef} src={imageSrc} onError={onError} alt="" />
          )
      )
      : (
        <IonIcon style={contentStyle} ref={setRef} src="/assets/icons/checked.svg" />
      )
  }</div>

}

export default Component
