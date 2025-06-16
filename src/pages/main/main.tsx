import { PageWrapper } from '../../components/page-wrapper/page-wrapper';
import styles from './style.module.css';
import { useAuth } from '../../components/hooks/useAuth';

export function HomePage() {
  const { userInfo } = useAuth();

  return (
    <PageWrapper title="Space Real Estate">
      <div className={styles['content-container']}>
        <div className={styles['page-data']}>
          <h1 className={styles['page-title']}>
            {userInfo?.firstName ? `Hello, ${userInfo.firstName}!` : ''} Welcome to Space Real Estate!
          </h1>
          <h3 className={styles['page-data-title']}>
            We will help you spend your money tastefully and with undoubted benefit. Hurry! There are few houses left!
          </h3>

          <h2 className={styles['promo-title']}>Take advantage of our special promo codes!</h2>
          <ul className={styles.list}>
            We’ve prepared exclusive discounts for our customers — don’t miss your chance to save big on your next
            property purchase:
            <li className={styles['list-item']}>
              <b>FIRST</b> – Get <b>20% off your entire cart</b>. Perfect for first-time customers or anyone ready to
              make a smart investment.
            </li>
            <li className={styles['list-item']}>
              <b>OPEN</b> – Celebrate our grand opening with a <b>$20,000 discount on your total purchase</b>. A
              limited-time offer to welcome our first clients.
            </li>
            <li className={styles['list-item']}>
              <b>STELLAR</b> – Receive a <b>5% discount</b> on properties from Stellar Estates. A special offer in
              partnership with this trusted developer.
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}
