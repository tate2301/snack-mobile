import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { TabBarIcon } from './navigation/TabBarIcon';
import { ITemplate } from '@/services/TemplateService';

interface TemplateCardProps {
  template: ITemplate;
  onSelect: () => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <ThemedView style={styles.container} onTouchEnd={onSelect}>
      <ThemedView style={styles.header}>
        <TabBarIcon name={template.icon as any} color="#FFFFFF" size={24} />
        <ThemedText type="subtitle">{template.title}</ThemedText>
      </ThemedView>
      
      {template.description && (
        <ThemedText style={styles.description}>{template.description}</ThemedText>
      )}

      <ThemedView style={styles.metrics}>
        <ThemedText style={styles.metricsLabel}>Default Metrics:</ThemedText>
        {template.defaultMetrics.map((metric) => (
          <ThemedView key={metric.id} style={styles.metricChip}>
            <TabBarIcon name={metric.icon as any} color="#FFFFFF" size={16} />
            <ThemedText style={styles.metricText}>{metric.name}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  description: {
    opacity: 0.7,
  },
  metrics: {
    gap: 8,
  },
  metricsLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  metricChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  metricText: {
    fontSize: 12,
  },
}); 