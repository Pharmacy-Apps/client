import React from 'react'
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonButton, IonText } from '@ionic/react'

import { Header } from 'components'

const Component: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent className="ion-padding">
        <form onSubmit={() => {}}>
          <IonList lines="full" class="ion-no-margin ion-no-padding">
            <IonItem>
              <IonLabel position="stacked">First Name <IonText color="danger">*</IonText></IonLabel>
              <IonInput></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Title</IonLabel>
              <IonInput></IonInput>
            </IonItem>

            {/* <IonItem>
              <IonLabel position="stacked">Address</IonLabel>
              <IonInput placeholder="Address Line 1"></IonInput>
              <IonInput placeholder="Address Line 2"></IonInput>
              <IonInput placeholder="City"></IonInput>
              <IonInput placeholder="State"></IonInput>
              <IonInput placeholder="Zip Code"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Notes</IonLabel>
              <IonTextarea></IonTextarea>
            </IonItem> */}

          </IonList>

          <div className="ion-padding">
            <IonButton expand="block" type="submit" class="ion-no-margin">Create account</IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  )
}

export default Component
