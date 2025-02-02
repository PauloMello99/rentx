import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from 'styled-components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { getPlatformDate } from '../../utils/getPlatformDate';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Calendar, DayProps, generateInterval, MarkedDateProps } from '../../components/Calendar';

import { CarDTO } from '../../dtos/carDTO';

import ArrowSvg from '../../assets/arrow.svg';

import {
    Container,
    Header,
    Title,
    RentalPeriod,
    DateInfo,
    DateTitle,
    DateValue,
    Content,
    Footer,
} from './styles';

interface RentalPeriod {
    startFormatted: string;
    endFormatted: string;
}

interface Params {
    car: CarDTO;
}

export function Scheduling() {
    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params;
    const [lastSelectedDate, setLastSelectedDate] = useState({} as DayProps);
    const [markedDates, setMarkedDates] = useState<MarkedDateProps>({} as MarkedDateProps);
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod);
    const theme = useTheme();

    function handleConfirmRental() {
        navigation.navigate('SchedulingDetails', { car, dates: Object.keys(markedDates) });
    }

    function handleBack() {
        navigation.goBack();
    }

    function handleDayChange(date: DayProps) {
        let start = !lastSelectedDate.timestamp ? date : lastSelectedDate;
        let end = date;

        if (start.timestamp > end.timestamp) {
            start = end;
            end = start;
        }

        const interval = generateInterval(start, end);
        setLastSelectedDate(end);
        setMarkedDates(interval);

        const startDate = Object.keys(interval)[0];
        const endDate = Object.keys(interval)[Object.keys(interval).length - 1];
        setRentalPeriod({
            startFormatted: format(getPlatformDate(new Date(startDate)), 'dd/MM/yyyy'),
            endFormatted: format(getPlatformDate(new Date(endDate)), 'dd/MM/yyyy'),
        });
    }

    return (
        <Container>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Header>
                <BackButton onPress={handleBack} color={theme.colors.shape} />
                <Title>
                    Escolha uma {`\n`}data de início e {`\n`}fim do aluguel
                </Title>
                <RentalPeriod>
                    <DateInfo>
                        <DateTitle>De</DateTitle>
                        <DateValue selected={!!rentalPeriod.startFormatted}>
                            {rentalPeriod.startFormatted}
                        </DateValue>
                    </DateInfo>

                    <ArrowSvg />

                    <DateInfo>
                        <DateTitle>Até</DateTitle>
                        <DateValue selected={!!rentalPeriod.endFormatted}>
                            {rentalPeriod.endFormatted}
                        </DateValue>
                    </DateInfo>
                </RentalPeriod>
            </Header>
            <Content>
                <Calendar markedDate={markedDates} onDayPress={handleDayChange} />
            </Content>
            <Footer>
                <Button
                    title="Confirmar"
                    onPress={handleConfirmRental}
                    enabled={!!rentalPeriod.startFormatted}
                />
            </Footer>
        </Container>
    );
}
