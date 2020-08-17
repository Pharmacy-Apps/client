import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'

type Props = { src: string, selected: boolean, alt?: string, item: string }

const placeholder = '/assets/icons/no-icon.svg'

const elementStyle = {
  height: '100px',
  width: '100px',
  padding: '5px 25px',
  margin: 0
}

const Component: React.FC<Props> = ({ item, src, selected }) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [imageRef, setImageRef]: [
    Element | undefined, Dispatch<SetStateAction<Element | undefined>>
  ]
    = useState()
  const [observerSet, setObserverSet] = useState(false)

  const setRef = (node: any) => {
    setImageRef(node)
  }

  const onError = function () {
    setObserverSet(true)
    setImageSrc(placeholder)
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

  return <img style={elementStyle} ref={setRef} src={
    selected ? '/assets/icons/checked.svg' : imageSrc
  } alt="" onError={onError} />

}

export default Component
