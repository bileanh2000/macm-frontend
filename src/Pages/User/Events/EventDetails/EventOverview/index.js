import React, { Fragment, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Edit } from '@mui/icons-material';
import eventApi from 'src/api/eventApi';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function TournamentOverview({ tournament, onUpdateTournament, value, index, schedule, isUpdate }) {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('md'));
    let { id } = useParams();
    const fetchAllRoleByEventId = async (eventId) => {
        try {
            const response = await eventApi.getAllOrganizingCommitteeRoleByEventId(eventId);
            setRoleList(response.data);
            console.log('fetch all role by event id', response);
        } catch (error) {
            console.error('failed when fetch all role by event id', error);
        }
    };

    useEffect(() => {
        fetchAllRoleByEventId(id);
    }, [id, isUpdate]);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {matches
                ? tournament && (
                      <Fragment>
                          <TableContainer>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead>
                                      <TableRow>
                                          <TableCell>Nội dung</TableCell>
                                          <TableCell align="left">Vai trò ban tổ chức</TableCell>
                                          <TableCell align="left">Chi phí</TableCell>
                                          <TableCell align="left">Thời gian</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      <TableRow
                                          sx={{
                                              '&:last-child td, &:last-child th': { border: 0 },
                                              verticalAlign: 'baseline',
                                          }}
                                      >
                                          <TableCell component="th" scope="row">
                                              <Typography variant="body1" sx={{}}>
                                                  {tournament.description}
                                              </Typography>
                                          </TableCell>
                                          <TableCell align="left">
                                              <ul>
                                                  {roleList.map((role) => {
                                                      return (
                                                          <li key={role.id}>
                                                              <strong>{role.name}</strong>:{' '}
                                                              {role.maxQuantity - role.availableQuantity}/
                                                              {role.maxQuantity} người
                                                          </li>
                                                      );
                                                  })}
                                              </ul>
                                          </TableCell>
                                          <TableCell align="left">
                                              <ul>
                                                  <li>
                                                      {!tournament.totalAmountActual ? (
                                                          <>
                                                              <strong>Dự kiến số tiền mỗi người cần phải đóng: </strong>
                                                              {tournament.amountPerRegisterEstimated.toLocaleString()}{' '}
                                                              VND
                                                          </>
                                                      ) : (
                                                          <>
                                                              <strong>Số tiền mỗi người cần phải đóng: </strong>
                                                              {tournament.amountPerRegisterActual.toLocaleString()} VND
                                                          </>
                                                      )}
                                                  </li>
                                              </ul>
                                          </TableCell>
                                          <TableCell align="left">
                                              <ul>
                                                  <li>
                                                      <strong>Thời gian bắt đầu: </strong>
                                                      <br />
                                                      {schedule[0].startTime.slice(0, 5)} -{' '}
                                                      {moment(schedule[0].date).format('DD/MM/yyyy')}
                                                  </li>
                                                  <li>
                                                      <strong>Thời gian kết thúc: </strong>
                                                      <br />
                                                      {schedule[schedule.length - 1].finishTime.slice(0, 5)} -{' '}
                                                      {moment(schedule[schedule.length - 1].date).format('DD/MM/yyyy')}
                                                  </li>
                                                  <li>
                                                      <strong>Deadline đăng ký tham gia: </strong>
                                                      <br />
                                                      {moment(tournament.registrationMemberDeadline).format(
                                                          'HH:mm - DD/MM/yyyy',
                                                      )}
                                                  </li>
                                                  {tournament.registrationOrganizingCommitteeDeadline ===
                                                  null ? null : (
                                                      <li>
                                                          <strong>Deadline đăng ký BTC: </strong>
                                                          <br />
                                                          {moment(
                                                              tournament.registrationOrganizingCommitteeDeadline,
                                                          ).format('HH:mm - DD/MM/yyyy')}
                                                      </li>
                                                  )}
                                              </ul>
                                          </TableCell>
                                      </TableRow>
                                  </TableBody>
                              </Table>
                          </TableContainer>
                      </Fragment>
                  )
                : tournament && (
                      <Box sx={{ padding: '10px 0px 10px 0px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', marginBottom: '10px' }}>
                              <div>
                                  <strong>Thời gian bắt đầu: </strong>
                                  <br />
                                  {schedule[0].startTime.slice(0, 5)} - {moment(schedule[0].date).format('DD/MM/yyyy')}
                              </div>
                              <div>
                                  <strong>Thời gian kết thúc: </strong>
                                  <br />
                                  {schedule[schedule.length - 1].finishTime.slice(0, 5)} -{' '}
                                  {moment(schedule[schedule.length - 1].date).format('DD/MM/yyyy')}
                              </div>
                              <div>
                                  <strong>Deadline đăng ký: </strong>
                                  <br />
                                  {moment(tournament.registrationMemberDeadline).format('HH:mm - DD/MM/yyyy')}
                              </div>
                              <div>
                                  {tournament.registrationOrganizingCommitteeDeadline === null ? null : (
                                      <>
                                          <strong>Deadline đăng ký BTC: </strong>
                                          <br />
                                          {moment(tournament.registrationOrganizingCommitteeDeadline).format(
                                              'HH:mm - DD/MM/yyyy',
                                          )}
                                      </>
                                  )}
                              </div>
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                              <strong>Nội dung:</strong> {tournament.description}
                          </div>
                          <div style={{ marginBottom: '10px' }}>
                              <strong>Vai trò trong sự kiện:</strong>
                              <ul>
                                  {roleList.map((role) => {
                                      return (
                                          <li key={role.id} style={{ marginLeft: '10px !important' }}>
                                              {'  '} - {role.name}: {role.maxQuantity - role.availableQuantity}/
                                              {role.maxQuantity} người
                                          </li>
                                      );
                                  })}
                              </ul>
                          </div>
                          <div>
                              <strong>Chi phí:</strong>
                              <ul>
                                  <li>
                                      {!tournament.totalAmountActual ? (
                                          <>
                                              {'  '} - Dự kiến số tiền mỗi người cần phải đóng:{' '}
                                              {tournament.amountPerRegisterEstimated.toLocaleString()} VND
                                          </>
                                      ) : (
                                          <>
                                              {'  '} - Số tiền mỗi người cần phải đóng:{' '}
                                              {tournament.amountPerRegisterActual.toLocaleString()} VND
                                          </>
                                      )}
                                  </li>
                              </ul>
                          </div>
                      </Box>
                  )}
        </div>
    );
}
export default TournamentOverview;
