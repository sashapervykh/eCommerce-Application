import { Card, Text, Modal } from '@gravity-ui/uikit';
import { useState } from 'react';
import styles from './style.module.css';

export function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const teamMembers = [
    {
      name: 'Andrey Voronin',
      role: 'Mentor',
      github: 'AVor0n',
      bio: 'Experienced developer guiding the team through the project, providing architectural advice and code reviews.',
      contributions: 'Project architecture guidance, code quality oversight, and team mentoring.',
    },
    {
      name: 'Aleksandr Pervykh',
      role: 'Frontend Developer',
      github: 'sashapervykh',
      bio: 'Passionate React developer focused on creating smooth user interfaces and interactive components.',
      contributions: 'Implemented core routing, product catalog, and state management.',
    },
    {
      name: 'Evgeniy Smirnov',
      role: 'Frontend Developer',
      github: 'maxnope',
      bio: 'Specializes in API integration and data flow optimization between frontend and CommerceTools.',
      contributions: 'CommerceTools API integration, product data management, and cart functionality.',
    },
    {
      name: 'Grigori Konopelko',
      role: 'Frontend Developer',
      github: 'gkonopelko',
      bio: 'Design-focused developer ensuring the application is both beautiful and user-friendly.',
      contributions: 'Designed UI components, implemented responsive layouts, and created visual assets.',
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
      <div className={styles['rocket-container']}>
        <div className={styles.rocket}>
          <div className={styles['rocket-body']}>
            <div className={styles['windows-row']}>
              {teamMembers.map((member, index) => (
                <div key={index} className={styles['window-container']} onClick={() => handleMemberClick(index)}>
                  <div className={styles.window}>
                    <div className={styles['window-frame']}>
                      <span className={styles['member-name']}>{member.name}</span>
                    </div>
                    <img
                      src={`https://github.com/${member.github}.png`}
                      alt={member.name}
                      className={styles['member-photo']}
                      loading="lazy"
                    />
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
            <Text variant="display-1">{teamMembers[selectedMember].name}</Text>
            <Text variant="header-1" color="secondary">
              {teamMembers[selectedMember].role}
            </Text>
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
              <Text color="info">View GitHub Profile</Text>
            </a>
          </Card>
        </Modal>
      )}
    </div>
  );
}
