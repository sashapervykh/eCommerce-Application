import { Card, Text, Modal, Icon } from '@gravity-ui/uikit';
import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { Xmark } from '@gravity-ui/icons';

import aleksandrImg from '../../assets/images/aleksandr.png';
import andreyImg from '../../assets/images/andrey.png';
import evgeniImg from '../../assets/images/evgeni.png';
import grigoriImg from '../../assets/images/grigori.png';

export function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rocketReady, setRocketReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRocketReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const teamMembers = [
    {
      name: 'Andrey',
      surname: 'Voronin',
      role: 'Mentor',
      github: 'AVor0n',
      image: andreyImg,
      bio: 'A visionary full-stack developer and exceptional mentor with over a decade of experience in building scalable applications and leading high-performing teams. Andrey was the cornerstone of our project’s success, seamlessly blending his deep technical expertise with a rare gift for mentorship. His unwavering dedication, patience, and ability to explain complex concepts with clarity transformed our team into confident, skilled developers. Beyond technical guidance, Andrey fostered a collaborative environment where creativity and problem-solving thrived.',
      contributions:
        'Spearheaded the project’s architectural design, laying a robust foundation for scalability and maintainability. Provided unparalleled guidance through daily code reviews, elevating code quality and performance to professional standards. Instituted cutting-edge practices for testing, documentation, and CI/CD workflows. Led immersive workshops on advanced React patterns, state management optimization, and RESTful API design. His mentorship extended beyond code—he coached us in agile methodologies, debugging techniques, and even career development. Time and again, Andrey stepped in with hands-on assistance, whether resolving critical bugs or optimizing database queries, all while empowering us to grow independently.',
    },
    {
      name: 'Aleksandr',
      surname: 'Pervykh',
      role: 'Frontend Developer',
      github: 'sashapervykh',
      image: aleksandrImg,
      bio: 'A highly skilled Frontend Developer with a passion for crafting performant, intuitive interfaces. Aleksandr combines meticulous attention to detail with innovative problem-solving, delivering features that balance functionality with elegance. His structured approach and deep understanding of React make him an invaluable asset to any team.',
      contributions:
        'Engineered the dynamic routing system supporting nested routes and seamless navigation. Developed the product catalog’s advanced filtering (multi-category, price ranges) and sorting (relevance, ratings) systems. Architected the state management solution using React Context API, reducing prop drilling by 70%. Created interactive product cards with hover animations and responsive layouts. Pioneered the repository setup with optimized build configurations and ESLint/Prettier integrations. His work on the 404 page and auth flow navigation significantly improved user experience.',
    },
    {
      name: 'Evgeniy',
      surname: 'Smirnov',
      role: 'Frontend Developer',
      github: 'maxnope',
      image: evgeniImg,
      bio: 'An API integration maestro with exceptional talent for streamlining data flows and solving backend-frontend synergy challenges. Evgeniy’s ability to design resilient systems and his sharp eye for edge cases ensure seamless user experiences even under complex data scenarios.',
      contributions:
        'Masterminded the CommerceTools API integration for real-time product data, cart operations, and inventory checks. Built the registration system with multi-stage validation (including dynamic postal code validation by country) and address book management. Developed the product detail page with an interactive image slider and responsive tab system. Diagnosed and fixed critical SDK configuration issues that accelerated API response times by 40%. Implemented JWT-based authentication with automatic token refresh, enhancing security across login/registration flows.',
    },
    {
      name: 'Grigori',
      surname: 'Konopelko',
      role: 'Frontend Developer',
      github: 'gkonopelko',
      image: grigoriImg,
      bio: 'A design-centric developer with a flair for creating visually stunning, user-friendly interfaces. Grigori’s unique blend of aesthetic sensibility and technical prowess bridges the gap between design mockups and functional, accessible components.',
      contributions:
        'Designed and built the responsive header with adaptive navigation, user profile dropdowns, and search functionality. Developed the user profile system with editable fields, avatar uploads, and persistent preferences. Crafted pixel-perfect UI components (buttons, modals, tooltips) with consistent theming. Created comprehensive project documentation and streamlined the task board for agile workflows. His 404 page design and auth flow transitions added polish to the user journey, while his centralized navigation system improved usability across devices.',
    },
  ];

  const handleMemberClick = (index: number) => {
    setSelectedMember(index);
    setModalOpen(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.stars}></div>
      <div className={styles['stars-2']}></div>
      <div className={styles.planets}></div>
      <div className={`${styles['rocket-container']} ${rocketReady ? styles['rocket-ready'] : ''}`}>
        <div className={styles.rocket}>
          <div className={styles['rocket-body']}>
            <div className={styles['windows-row']}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles['window-container']} onClick={() => handleMemberClick(index)}>
                  <div className={styles.window}>
                    <div className={styles['window-frame']}>
                      <span className={styles['member-name']}>{member.name}</span>
                    </div>
                    <img src={member.image} alt={member.name} className={styles['member-photo']} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles['rocket-engine']}>
            <div className={styles['engine-nozzle']}></div>
            <div className={styles.flame}></div>
          </div>
        </div>
      </div>

      <div className={styles['team-info']}>
        <Text variant="display-2">Space Team</Text>
        <Text variant="header-1">Our Collaboration Journey</Text>
        <Text>
          Our team worked collaboratively using GitHub Projects for task management, with daily standups and code
          reviews. We divided responsibilities based on expertise while maintaining open communication. The mentor
          provided guidance while allowing us to grow through hands-on experience.
        </Text>
      </div>

      {selectedMember !== null && (
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <Card className={styles['modal-card']}>
            <button className={styles['close-button']} onClick={() => setModalOpen(false)} aria-label="Close modal">
              <Icon data={Xmark} size={18} />
            </button>
            <Text variant="display-1">
              {teamMembers[selectedMember].name} {teamMembers[selectedMember].surname}
            </Text>
            <Text variant="header-1">{teamMembers[selectedMember].role}</Text>
            <Text className={styles['bio-text']}>{teamMembers[selectedMember].bio}</Text>
            <Text className={styles['contributions-title']}>
              <span className={styles['bold-text']}>Key Contributions:</span>
            </Text>
            <Text>{teamMembers[selectedMember].contributions}</Text>
            <a
              href={`https://github.com/${teamMembers[selectedMember].github}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles['github-link']}
            >
              <Text color="link">View GitHub Profile</Text>
            </a>
            {teamMembers[selectedMember].role === 'Mentor' && (
              <div className={styles['testimonial-links']}>
                <Text className={styles['testimonial-title']}>Testimonials:</Text>
                <a
                  href="https://discord.com/channels/516715744646660106/517977765421776919/1380209186323038269"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['testimonial-link']}
                >
                  <Text color="link">Feedback from student #1</Text>
                </a>
                <a
                  href="https://discord.com/channels/516715744646660106/517977765421776919/1380209359308460094"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['testimonial-link']}
                >
                  <Text color="link">Feedback from student #2</Text>
                </a>
              </div>
            )}
          </Card>
        </Modal>
      )}
    </div>
  );
}
